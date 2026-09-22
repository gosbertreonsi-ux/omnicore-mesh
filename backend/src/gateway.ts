import express from 'express';
import type { Request, Response } from 'express';
import type { NetworkPacket } from '../../shared/types.ts';
import { verifyHmacSignature } from './security.ts';
import { orchestrateNaturalLanguageIntent } from './aiOrchestrator.ts';

// 1. Initialize System Application Infrastructure
const app = express();
app.use(express.json());

// Presentation In-Memory Ledger Storage Index
const transactionDatabase: any[] = [];

/**
 * 2. Security Validation Route (Full Stack + Security Layer Interface)
 * Enforces Upstream HMAC Verification and Role-Based Access Barriers (RBAC)
 */
app.post('/api/v1/gateway/route', (req: Request, res: Response): void => {
  const packet: NetworkPacket = req.body;
  
  // A. Structural Checklist Validation
  if (!packet || !packet.route || !packet.payload) {
    res.status(400).json({ success: false, error: 'Malformed payload network package string.' });
    return;
  }

  // B. Upstream HMAC Integrity Gate Verification
  const incomingSignature = req.headers['x-signature'] as string;
  const isPayloadAuthentic = verifyHmacSignature(packet.payload, incomingSignature);

  if (!isPayloadAuthentic) {
    res.status(401).json({ 
      success: false, 
      error: 'CRITICAL: Upstream HMAC Verification failed. Tampered or unsigned data dropped!' 
    });
    return;
  }

  // C. Role-Based Access Control (RBAC) Barriers
  const userRole = req.headers['x-user-role'] as string;
  if (userRole !== 'SYSTEM_ADMIN' && userRole !== 'FINANCIAL_MANAGER') {
    res.status(403).json({
      success: false,
      error: 'SECURITY EXCEPTION: Active role tier has insufficient clearance for ledger modification.'
    });
    return;
  }

  // D. Secure Data Ledger Append Action
  const { transactionId, amount, currency, status } = packet.payload;
  const record = {
    id: `tx_${Math.random().toString(36).substring(2, 11)}`,
    transactionId,
    amount,
    currency,
    status,
    timestamp: new Date().toISOString()
  };

  transactionDatabase.push(record);
  
  res.status(200).json({
    success: true,
    message: 'Event safely passed security checks and successfully routed.',
    dispatchedRoute: packet.route,
    ledgerIndex: record
  });
});

/**
 * 3. AI Core Orchestrator Entry (AI Systems Layer Interface)
 * Intercepts text strings and matches them to strict deterministic JSON shapes
 */
app.post('/api/v1/ai/orchestrate', (req: Request, res: Response): void => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ success: false, error: 'AI Orchestrator requires an unstructured prompt input string.' });
    return;
  }

  // Process free-form natural language using the Multi-Agent framework
  const orchestrationResult = orchestrateNaturalLanguageIntent(prompt);

  if (!orchestrationResult) {
    res.status(422).json({
      success: false,
      error: 'AI Core Exception: Unidentified user intent string. No specialized agent swarm caught the packet.'
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'AI Swarm successfully generated type-valid secure payload packets deterministic data blocks.',
    orchestration: orchestrationResult
  });
});

// 4. Execution Initialization Target
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Secure OmniCore Gateway active on port 5001`);
});
