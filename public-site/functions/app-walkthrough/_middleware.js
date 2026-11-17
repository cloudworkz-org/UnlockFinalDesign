// functions/app-walkthrough/_middleware.js
// -----------------------------------------------------------------------------
// Password gate for EVERYTHING under /app-walkthrough/ (pages, Login page and
// the runtime script). The server refuses to send any file unless the visitor
// supplies the right username and password (HTTP Basic authentication).
//
// Username: "unlock". The password is never stored here: only a random salt and
// the PBKDF2-HMAC-SHA256 hash of the password (100,000 iterations, the most
// Cloudflare Workers' crypto.subtle allows). Both values below are safe to
// publish; they cannot be turned back into the password.
//
// To change the password, make a new salt and hash and replace the two
// constants below.
// -----------------------------------------------------------------------------

const USERNAME = "unlock";
const SALT_HEX = "8715b79668e7689f72e330e5e52f04e6";
const HASH_HEX = "23443ea9b0dbfe5eda7ad0ab5f7f42fafaf8d3419fa2af8a23d91d5858b7d346";
const ITERATIONS = 100000;
const MAX_PASSWORD_BYTES = 1024; // refuse absurdly long input before doing any work

export async function onRequest(context) {
  const { request, next } = context;

  if (await isAuthorised(request)) {
    const response = await next();
    const out = new Response(response.body, response);
    out.headers.set("Cache-Control", "private, no-store");
    return out;
  }
  return unauthorised();
}

function unauthorised() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Unlock walkthrough", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}

async function isAuthorised(request) {
  const creds = readBasicCredentials(request);
  if (!creds) return false;

  // Always do the same work, whether or not the username is right.
  const derived = await derive(creds.password);
  const passwordOk = timingSafeEqual(derived, HASH_HEX);
  const userOk = timingSafeEqual(creds.username, USERNAME);
  return passwordOk && userOk;
}

function readBasicCredentials(request) {
  const header = request.headers.get("Authorization") || "";
  const m = header.match(/^Basic\s+([A-Za-z0-9+/=_-]+)$/i);
  if (!m) return null;

  let bytes;
  try {
    const bin = atob(m[1].replace(/-/g, "+").replace(/_/g, "/"));
    bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }

  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }

  const idx = text.indexOf(":"); // the username cannot contain ":", the password can
  if (idx === -1) return null;
  const password = text.slice(idx + 1);
  if (new TextEncoder().encode(password).length > MAX_PASSWORD_BYTES) return null;
  return { username: text.slice(0, idx), password };
}

async function derive(password) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: hexToBytes(SALT_HEX), iterations: ITERATIONS },
    key,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Compare in constant time (no early exit), also when the lengths differ.
function timingSafeEqual(a, b) {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let out = ea.length ^ eb.length;
  for (let i = 0; i < ea.length; i++) out |= ea[i] ^ (eb[i % (eb.length || 1)] || 0);
  return out === 0;
}
