/**
 * Password hashing using Web Crypto API (works in Edge and Node).
 * PBKDF2-SHA256, 100k iterations, 16-byte salt, 32-byte key. Stored as saltHex:hashHex.
 */

const SALT_LEN = 16;
const KEY_LEN = 32;
const ITERATIONS = 100_000;

function bufToHex(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf;
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuf(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes.buffer;
}

function timingSafeEqual(a: ArrayBuffer, b: ArrayBuffer): boolean {
  const ua = new Uint8Array(a);
  const ub = new Uint8Array(b);
  if (ua.length !== ub.length) return false;
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(plain),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    key,
    KEY_LEN * 8
  );
  return `${bufToHex(salt)}:${bufToHex(derived)}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  try {
    const salt = hexToBuf(saltHex);
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(plain),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const derived = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: ITERATIONS,
        hash: "SHA-256",
      },
      key,
      KEY_LEN * 8
    );
    return timingSafeEqual(derived, hexToBuf(hashHex));
  } catch {
    return false;
  }
}
