import crypto from 'crypto';

// System secret key used to compute and verify message integrity signatures
const HMAC_SECRET_KEY = process.env.HMAC_SECRET || 'skyconnect_secure_presentation_token_2026';

/**
 * Verifies that the inbound payload has not been modified or tampered with
 * @param payload The raw string or object payload data string
 * @param incomingSignature The SHA-256 signature attached to the network header
 */
export function verifyHmacSignature(payload: object, incomingSignature: string | undefined): boolean {
  if (!incomingSignature) return false;

  // Convert payload object to deterministic string format
  const serializedPayload = JSON.stringify(payload);

  // Compute the expected SHA-256 signature using the system secret key
  const calculatedSignature = crypto
    .createHmac('sha256', HMAC_SECRET_KEY)
    .update(serializedPayload)
    .digest('hex');

  // Perform a constant-time comparison to prevent timing side-channel attacks
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'hex'),
    Buffer.from(incomingSignature, 'hex')
  );
}
