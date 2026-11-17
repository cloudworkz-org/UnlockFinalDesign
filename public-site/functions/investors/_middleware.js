// functions/investors/_middleware.js
// -----------------------------------------------------------------------------
// Self-certification gate, scoped to /investors/* only. Open without a cookie:
// the gate page itself and the static files it needs (styles, tokens, fonts,
// logos). Everything else, including every other file type, needs a cookie
// that verifies (signature, statement version, expiry) on every request.
// Missing/invalid/expired -> 302 to /investors/?next=<path>.
//
// Needs SELFCERT_SECRET on the Pages project.
// -----------------------------------------------------------------------------

import { COOKIE_NAME, readCookie, verifyToken } from "../_lib/cert.js";

const OPEN_PATHS = new Set(["/investors", "/investors/", "/investors/index.html"]);
const OPEN_PREFIXES = [
  "/investors/tokens/", "/investors/fonts/", "/investors/assets/",
];
const OPEN_FILES = new Set(["/investors/styles.css"]);

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (
    OPEN_PATHS.has(path) || OPEN_FILES.has(path) ||
    OPEN_PREFIXES.some((p) => path.startsWith(p) && !path.includes(".."))
  ) {
    return next();
  }

  const token = readCookie(request, COOKIE_NAME);
  if (token && (await verifyToken(token, env.SELFCERT_SECRET))) {
    const res = await next();
    const out = new Response(res.body, res);
    out.headers.set("Cache-Control", "private, no-store");
    return out;
  }

  const dest = new URL("/investors/", url.origin);
  dest.searchParams.set("next", path + url.search);
  return new Response(null, {
    status: 302,
    headers: { Location: dest.toString(), "Cache-Control": "no-store" },
  });
}
