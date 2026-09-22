import { calculateHmacSignature } from './security.ts';

const GATEWAY_URL = 'http://localhost:5001';

async function executeSystemIntegrationTests() {
  console.log('🚀 INITIALIZING OMNICORE MESH PLATFORM INTEGRATION SUITE...\n');

  // Baseline transaction payload data model
  const basePayload = {
    transactionId: 'tx_skyconnect_demo_99',
    merchantId: 'merchant_sasaride_terminal',
    amount: 250.75,
    currency: 'USD',
    status: 'PENDING' as const,
    timestamp: new Date().toISOString()
  };

  // Compute a valid cryptographic hash signature using the system key
  const validSignature = calculateHmacSignature(basePayload);

  // ==========================================
  // CASE 1: Valid Signed Transaction Payload (Authorized Admin)
  // ==========================================
  console.log('--- TEST 1: Sending Valid Signed Payload with Admin Clearance ---');
  try {
    const res = await fetch(`${GATEWAY_URL}/api/v1/gateway/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signature': validSignature,
        'x-user-role': 'SYSTEM_ADMIN'
      },
      body: JSON.stringify({
        route: '/api/v1/payments/settle',
        payload: basePayload
      })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2), '\n');
  } catch (err) {
    console.error('Test 1 failed to connect:', err);
  }

  // ==========================================
  // CASE 2: Security Gate Interception (Tampered Signature Verification)
  // ==========================================
  console.log('--- TEST 2: Sending Payload with Malicious/Missing Signature ---');
  try {
    const res = await fetch(`${GATEWAY_URL}/api/v1/gateway/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signature': 'invalid_forged_hash_value',
        'x-user-role': 'SYSTEM_ADMIN'
      },
      body: JSON.stringify({
        route: '/api/v1/payments/settle',
        payload: basePayload
      })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2), '\n');
  } catch (err) {}

  // ==========================================
  // CASE 3: Role Barrier Breach Interception (RBAC Failure)
  // ==========================================
  console.log('--- TEST 3: Sending Valid Signed Payload with Low Clearance Role ---');
  try {
    const res = await fetch(`${GATEWAY_URL}/api/v1/gateway/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signature': validSignature,
        'x-user-role': 'STANDARD_USER' // Lacks access privileges
      },
      body: JSON.stringify({
        route: '/api/v1/payments/settle',
        payload: basePayload
      })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2), '\n');
  } catch (err) {}

  // ==========================================
  // CASE 4: AI Core Multi-Agent Swarm Orchestration
  // ==========================================
  console.log('--- TEST 4: Sending Natural Language Command to AI Orchestrator ---');
  try {
    const res = await fetch(`${GATEWAY_URL}/api/v1/ai/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Please process a new charging payment request of 650 dollars immediately.'
      })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2), '\n');
  } catch (err) {}

  console.log('🏁 SYSTEM UTILITY TEST CYCLE COMPLETE.');
}

executeSystemIntegrationTests();
