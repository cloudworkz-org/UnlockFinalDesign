// functions/api/certify.js
// -----------------------------------------------------------------------------
// Called by the gate page when a visitor completes the eligibility statement.
// Writes an audit record to D1, then issues a signed (HMAC-SHA256) cookie that
// is valid for a FIXED 12 months from now (never refreshed on later visits).
//
// POST JSON body: { type, statementVersion, next }
//
// Needs on the Pages project:
//   secret  SELFCERT_SECRET   (signing key; Cloudflare secret, not in repo)
//   D1      CERT_DB           (see d1/schema.sql)
// -----------------------------------------------------------------------------

import {
  COOKIE_NAME, STATEMENT_VERSION, TTL_MS, CATEGORIES, signToken, safeNext,
} from "../_lib/cert.js";

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "invalid_body" }, 400);
  }
  if (!data || !CATEGORIES.includes(data.type)) {
    return json({ error: "invalid_type" }, 400);
  }
  // The page must be showing the current wording; otherwise the audit record
  // would claim a statement the visitor did not see. Page reload fixes it.
  if (data.statementVersion !== STATEMENT_VERSION) {
    return json({ error: "stale_statement" }, 409);
  }
  if (!env.SELFCERT_SECRET || !env.CERT_DB) {
    return json({ error: "server_misconfigured" }, 500);
  }

  const now = Date.now();
  const exp = now + TTL_MS;

  // Audit first: if the record cannot be kept, no certification is issued.
  try {
    await env.CERT_DB.prepare(
      `INSERT INTO certifications
         (id, certified_at, category, statement_version, ip, user_agent, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      crypto.randomUUID(),
      new Date(now).toISOString(),
      data.type,
      STATEMENT_VERSION,
      request.headers.get("CF-Connecting-IP"),
      (request.headers.get("User-Agent") || "").slice(0, 512),
      new Date(exp).toISOString()
    ).run();
  } catch {
    return json({ error: "audit_failed" }, 500);
  }

  const token = await signToken(
    { type: data.type, v: STATEMENT_VERSION, iat: now, exp },
    env.SELFCERT_SECRET
  );
  const cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${Math.floor(TTL_MS / 1000)}`,
  ].join("; ");

  return new Response(JSON.stringify({ ok: true, next: safeNext(data.next) }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Set-Cookie": cookie,
    },
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
