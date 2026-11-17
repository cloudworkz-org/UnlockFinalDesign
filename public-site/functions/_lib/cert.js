// functions/_lib/cert.js
// Shared by /api/certify and the /investors/* guard. No route exports here.

export const COOKIE_NAME = "unlock_selfcert";

// Identifies the exact gate wording a visitor saw. BUMP THIS whenever the
// declarations or risk warnings in public/investors/index.html change: every
// existing cookie then stops verifying and visitors re-certify. The gate page
// carries the same value in data-statement-version.
export const STATEMENT_VERSION = "2026-06-30-v1";

// Fixed from the certification date; never extended by later visits.
// 365 days is never more than 12 months. Compliance to confirm the period.
export const TTL_DAYS = 365;
export const TTL_MS = TTL_DAYS * 24 * 60 * 60 * 1000;

export const CATEGORIES = ["hnw", "sophisticated", "self-sophisticated"];
export const DEFAULT_NEXT = "/investors/pitch/";

// Same-origin /investors/ paths only. Anything else falls back to the default.
export function safeNext(next) {
  if (typeof next !== "string" || next.length > 2048) return DEFAULT_NEXT;
  if (!next.startsWith("/investors/") || next.includes("\\")) return DEFAULT_NEXT;
  if (/[\u0000-\u001f\u007f]/.test(next)) return DEFAULT_NEXT;
  try {
    const u = new URL(next, "https://x.invalid");
    if (u.origin !== "https://x.invalid" || !u.pathname.startsWith("/investors/")) {
      return DEFAULT_NEXT;
    }
  } catch {
    return DEFAULT_NEXT;
  }
  return next;
}

export async function signToken(payload, secret) {
  const body = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  return `${body}.${await hmac(body, secret)}`;
}

// Returns the payload if the signature, statement version and expiry are all
// valid right now; otherwise null.
export async function verifyToken(token, secret, now = Date.now()) {
  if (!secret || typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!timingSafeEqual(sig, await hmac(body, secret))) return null;
  try {
    const p = JSON.parse(new TextDecoder().decode(unb64url(body)));
    if (!CATEGORIES.includes(p.type)) return null;
    if (p.v !== STATEMENT_VERSION) return null;
    if (!Number.isFinite(p.iat) || !Number.isFinite(p.exp)) return null;
    if (p.exp - p.iat > TTL_MS) return null; // never honour > 12 months
    if (now >= p.exp || p.iat > now + 60_000) return null;
    return p;
  } catch {
    return null;
  }
}

export function readCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      try { return decodeURIComponent(part.slice(idx + 1).trim()); } catch { return null; }
    }
  }
  return null;
}

async function hmac(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  return b64url(new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message))
  ));
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function b64url(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64url(s) {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (s.length % 4)) % 4));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
}
