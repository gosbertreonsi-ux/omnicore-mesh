import crypto from 'crypto';

const HMAC_SECRET_KEY = 'skyconnect_secure_presentation_token_2026';

/**
 * Deterministically stringifies an object by sorting its keys alphabetically.
 * Ensures identical string hashes across networks regardless of object key order.
 */
function deterministicStringify(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(deterministicStringify).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const properties = sortedKeys.map(key => `"${key}":${deterministicStringify(obj[key])}`);
  return '{' + properties.join(',') + '}';
}

export function calculateHmacSignature(payload: object): string {
  // Use our new deterministic sort tool instead of JSON.stringify
  const serializedPayload = deterministicStringify(payload);
  return crypto
    .createHmac('sha256', HMAC_SECRET_KEY)
    .update(serializedPayload)
    .digest('hex');
}

export function verifyHmacSignature(payload: object, incomingSignature: string | undefined): boolean {
  if (!incomingSignature) return false;

  const calculatedSignature = calculateHmacSignature(payload);

  if (calculatedSignature.length !== incomingSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'hex'),
    Buffer.from(incomingSignature, 'hex')
  );
}
