const BASE_GATEWAY_URL = 'http://localhost:5001';

/**
 * Fires a text request directly down to the AI Orchestrator Node
 */
export async function sendAiPrompt(prompt: string) {
  try {
    const response = await fetch(`${BASE_GATEWAY_URL}/api/v1/ai/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'AI Router Node unreachable.' };
  }
}

/**
 * Dispatches a transaction package with configurable security parameters
 */
export async function dispatchSecureTransaction(packet: object, signature: string, role: string) {
  try {
    const response = await fetch(`${BASE_GATEWAY_URL}/api/v1/gateway/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signature': signature,
        'x-user-role': role
      },
      body: JSON.stringify(packet),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Security Gate Node unreachable.' };
  }
}
