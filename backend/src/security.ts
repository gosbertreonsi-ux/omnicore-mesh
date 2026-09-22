import crypto from 'crypto';

// Presentation key used to compute and verify digital package signatures
const HMAC_SECRET_KEY = 'skyconnect_secure_presentation_token_2026';

/**
 * Computes a SHA-256 HMAC signature from an object payload
 */
export function calculateHmacSignature(payload: object): string {
  const serializedPayload = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', HMAC_SECRET_KEY)
    .update(serializedPayload)
    .digest('hex');
}

/**
 * Verifies that the inbound network packet matches the signature validation rules
 */
export function verifyHmacSignature(payload: object, incomingSignature: string | undefined): boolean {
  if (!incomingSignature) return false;

  const calculatedSignature = calculateHmacSignature(payload);

  // Use constant-time comparison to completely neutralize timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'hex'),
    Buffer.from(incomingSignature, 'hex')
  );
}
