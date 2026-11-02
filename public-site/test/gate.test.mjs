import test from "node:test";
import assert from "node:assert/strict";
import { onRequestPost } from "../functions/api/certify.js";
import { onRequest as guard } from "../functions/investors/_middleware.js";
import { safeNext, signToken, STATEMENT_VERSION, TTL_MS } from "../functions/_lib/cert.js";

const SECRET = "test-secret-not-real";
const rows = [];
const db = (fail) => ({ prepare: () => ({ bind: (...a) => ({ run: async () => { if (fail) throw new Error("x"); rows.push(a); } }) }) });
const post = (body, env, headers = {}) => onRequestPost({
  request: new Request("https://t.test/api/certify", { method: "POST", body: JSON.stringify(body), headers: { "CF-Connecting-IP": "203.0.113.9", "User-Agent": "UA/1", ...headers } }),
  env,
});
const get = (path, cookie, now) => guard({
  request: new Request("https://t.test" + path, { headers: cookie ? { Cookie: cookie } : {} }),
  env: { SELFCERT_SECRET: SECRET },
  next: async () => new Response("PITCH"),
});
const good = { type: "hnw", statementVersion: STATEMENT_VERSION, next: "/investors/deck/" };

test("certify: cookie flags, 12-month cap, audit row, next", async () => {
  const res = await post(good, { SELFCERT_SECRET: SECRET, CERT_DB: db() });
  assert.equal(res.status, 200);
  const sc = res.headers.get("Set-Cookie");
  for (const f of ["HttpOnly", "Secure", "SameSite=Lax", "Path=/"]) assert.ok(sc.includes(f), f);
  const age = Number(/Max-Age=(\d+)/.exec(sc)[1]);
  assert.ok(age <= 366 * 86400 && age === TTL_MS / 1000);
  assert.equal((await res.json()).next, "/investors/deck/");
  const [, at, cat, ver, ip, ua, exp] = rows.at(-1);
  assert.equal(cat, "hnw"); assert.equal(ver, STATEMENT_VERSION);
  assert.equal(ip, "203.0.113.9"); assert.equal(ua, "UA/1");
  assert.ok(new Date(exp) - new Date(at) <= 366 * 86400e3);
});

test("certify: ip in body is ignored; bad type/stale/misconfig/audit fail", async () => {
  await post({ ...good, ip: "1.1.1.1" }, { SELFCERT_SECRET: SECRET, CERT_DB: db() });
  assert.equal(rows.at(-1)[4], "203.0.113.9");
  assert.equal((await post({ ...good, type: "x" }, { SELFCERT_SECRET: SECRET, CERT_DB: db() })).status, 400);
  assert.equal((await post({ ...good, statementVersion: "old" }, { SELFCERT_SECRET: SECRET, CERT_DB: db() })).status, 409);
  assert.equal((await post(good, { CERT_DB: db() })).status, 500);
  assert.equal((await post(good, { SELFCERT_SECRET: SECRET })).status, 500);
  const r = await post(good, { SELFCERT_SECRET: SECRET, CERT_DB: db(true) });
  assert.equal(r.status, 500); assert.equal(r.headers.get("Set-Cookie"), null);
});

test("guard: no cookie / tampered / expired / old version / wrong secret -> gate", async () => {
  const redir = async (c, p = "/investors/pitch/") => { const r = await get(p, c); assert.equal(r.status, 302); return r.headers.get("Location"); };
  assert.equal(await redir(), "https://t.test/investors/?next=%2Finvestors%2Fpitch%2F");
  const now = Date.now();
  const mk = (p, s = SECRET) => signToken(p, s);
  const valid = await mk({ type: "hnw", v: STATEMENT_VERSION, iat: now, exp: now + TTL_MS });
  const ck = (t) => `unlock_selfcert=${encodeURIComponent(t)}`;
  assert.equal((await get("/investors/pitch/", ck(valid))).status, 200);
  assert.equal((await get("/investors/data.json", ck(valid))).status, 200);
  await redir(ck(valid.slice(0, -2) + "xx"));
  await redir(ck(await mk({ type: "hnw", v: STATEMENT_VERSION, iat: now, exp: now + TTL_MS }, "other")));
  await redir(ck(await mk({ type: "hnw", v: STATEMENT_VERSION, iat: now - 2 * TTL_MS, exp: now - TTL_MS })));
  await redir(ck(await mk({ type: "hnw", v: "old", iat: now, exp: now + TTL_MS })));
  await redir(ck(await mk({ type: "hnw", v: STATEMENT_VERSION, iat: now, exp: now + 3 * TTL_MS })));
  await redir(ck(await mk({ type: "hnw", v: STATEMENT_VERSION, iat: now, exp: now + TTL_MS })), "/investors/x.json");
});

test("guard: gate + its assets open; other files gated", async () => {
  for (const p of ["/investors/", "/investors", "/investors/styles.css", "/investors/tokens/a.css", "/investors/fonts/f.woff2", "/investors/assets/unlock-white.svg"])
    assert.equal((await get(p)).status, 200, p);
  for (const p of ["/investors/pitch/", "/investors/deck/", "/investors/pitch/index.html", "/investors/x.json", "/investors/x.js", "/investors/assets/../pitch/index.html"])
    assert.equal((await get(p)).status, 302, p);
});

test("safeNext: only /investors/ same-origin paths", () => {
  for (const bad of ["//evil.com", "/\\evil.com", "https://evil.com", "/foo", "/investors/\\x", "/investors/\n", "javascript:alert(1)", null, 5])
    assert.equal(safeNext(bad), "/investors/pitch/", String(bad));
  assert.equal(safeNext("/investors/deck/?a=1"), "/investors/deck/?a=1");
});
