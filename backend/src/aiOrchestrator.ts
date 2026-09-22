import { calculateHmacSignature } from './security.ts';

interface DispatchedAgentOutput {
  agentName: string;
  intentIdentified: string;
  confidenceScore: number;
  generatedPacket: {
    route: string;
    payload: {
      transactionId: string;
      merchantId: string;
      amount: number;
      currency: string;
      status: 'PENDING' | 'SUCCESS' | 'FAILED';
      timestamp: string;
    };
    signature: string;
  };
}

/**
 * Unified Core AI Orchestrator
 * Intercepts free-form chat data, extracts intent, and triggers agent swarms
 */
export function orchestrateNaturalLanguageIntent(userInput: string): DispatchedAgentOutput | null {
  const lowercaseInput = userInput.toLowerCase();

  // Agent Swarm 1: Transaction Processing Routine
  if (lowercaseInput.includes('payment') || lowercaseInput.includes('charge') || lowercaseInput.includes('pay')) {
    
    // Deterministic extraction logic mimicking deep entity parsing
    const extractedAmount = parseFloat(userInput.match(/\d+(\.\d+)?/)?.[0] || '150.00');
    const txId = `tx_ai_${Math.random().toString(36).substring(2, 7)}`;
    
    const basePayload = {
      transactionId: txId,
      merchantId: 'merchant_skyconnect_global',
      amount: extractedAmount,
      currency: 'USD',
      status: 'PENDING' as const,
      timestamp: new Date().toISOString()
    };

    // Deterministic Guardrails: Calculate signature internally to match gateway standards
    const secureSignature = calculateHmacSignature(basePayload);

    return {
      agentName: 'FINANCIAL_TRANSACTION_SWARM',
      intentIdentified: 'PROCESS_INBOUND_PAYMENT',
      confidenceScore: 0.98,
      generatedPacket: {
        route: '/api/v1/payments/execute',
        payload: basePayload,
        signature: secureSignature
      }
    };
  }

  // Agent Swarm 2: Anomaly & Risk Routine
  if (lowercaseInput.includes('fraud') || lowercaseInput.includes('alert') || lowercaseInput.includes('risk')) {
    const txId = `tx_risk_${Math.random().toString(36).substring(2, 7)}`;
    const basePayload = {
      transactionId: txId,
      merchantId: 'merchant_high_risk_flag',
      amount: 0.00,
      currency: 'SYSTEM',
      status: 'FAILED' as const,
      timestamp: new Date().toISOString()
    };

    const secureSignature = calculateHmacSignature(basePayload);

    return {
      agentName: 'ANOMALY_DETECTION_SWARM',
      intentIdentified: 'SUSPICIOUS_ACTIVITY_ALERT',
      confidenceScore: 0.95,
      generatedPacket: {
        route: '/api/v1/security/flag',
        payload: basePayload,
        signature: secureSignature
      }
    };
  }

  return null;
}
