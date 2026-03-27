/**
 * Decodes a JWT token payload (base64url → JSON).
 * Returns null if the token is invalid.
 */
export function decodeToken(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // base64url → base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonStr = atob(padded);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Returns true if the token is expired (or invalid).
 * Adds a 10-second buffer to account for clock skew.
 */
export function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowSeconds + 10;
}

/**
 * Extracts user info from the JWT payload.
 */
export function getUserFromToken(token) {
  const payload = decodeToken(token);
  if (!payload) return null;
  return {
    id: payload.sub || payload.userId || null,
    email: payload.email || payload.sub || '',
    role: payload.role || payload.roles?.[0] || '',
    fullName: payload.fullName || payload.name || '',
    exp: payload.exp,
  };
}
