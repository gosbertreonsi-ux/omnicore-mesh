import { expect, test, describe } from 'vitest';
import { calculateHmacSignature, verifyHmacSignature } from './security.ts';

describe('🛡️ OmniCore Security Layer Tests', () => {
  const testPayload = { transactionId: 'tx_test_123', amount: 99.99 };

  test('PASSES completely authentic signed payloads', () => {
    const validSignature = calculateHmacSignature(testPayload);
    const result = verifyHmacSignature(testPayload, validSignature);
    expect(result).toBe(true);
  });

  test('DROPS payloads with tampered or forged signatures', () => {
    const maliciousSignature = 'fake_signature_hash_value';
    const result = verifyHmacSignature(testPayload, maliciousSignature);
    expect(result).toBe(false);
  });
});
