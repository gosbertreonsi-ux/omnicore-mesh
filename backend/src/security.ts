import crypto from 'crypto';

const HMAC_SECRET_KEY = 'skyconnect_secure_presentation_token_2026';

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

  // Structural Guardrail: If signature lengths do not match, reject instantly
  // This prevents RangeErrors inside crypto.timingSafeEqual
  if (calculatedSignature.length !== incomingSignature.length) {
    return false;
  }

  // Use constant-time comparison to completely neutralize timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'hex'),
    Buffer.from(incomingSignature, 'hex')
  );
}
