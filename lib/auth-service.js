import crypto from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET || "gitamitra-sacred-wisdom-secret-key-2026";

// Hash password with unique random salt using PBKDF2 (100,000 iterations)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { salt, hash };
}

// Verify password using timing-safe comparison
export function verifyPassword(password, salt, storedHash) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
}

// Generate a 6-digit numeric verification code
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate base64url signed token (HMAC-SHA256)
export function createToken(payload, expiresInSeconds = 30 * 24 * 60 * 60) {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };

  const encodeBase64Url = obj => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const headerEncoded = encodeBase64Url(header);
  const payloadEncoded = encodeBase64Url(fullPayload);

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64url");

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

// Verify and decode signed token
export function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerEncoded, payloadEncoded, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadEncoded, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }
    return payload;
  } catch (_) {
    return null;
  }
}

// Extract Bearer token from authorization header
export function extractBearerToken(authHeader) {
  if (!authHeader || typeof authHeader !== "string") return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
