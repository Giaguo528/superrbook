import crypto from "node:crypto";

const COOKIE_NAME = "diary_session";
const MAX_AGE = 60 * 60 * 24 * 365;

// The session secret is derived from the PIN itself so a deployer only has
// to configure one env var (DIARY_PIN) to get a working, private instance.
function sessionSecret() {
  const pin = process.env.DIARY_PIN;
  if (!pin) return null;
  return crypto.createHash("sha256").update(`notebook-session:${pin}`).digest("hex");
}

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function parseCookies(header) {
  const out = {};
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(val);
  });
  return out;
}

export function verifySession(req) {
  const secret = sessionSecret();
  if (!secret) return false;
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  const expected = sign("ok", secret);
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function sessionCookie() {
  const secret = sessionSecret();
  const token = sign("ok", secret);
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}
