import express from 'express';
import type { Request, Response } from 'express';
import type { NetworkPacket } from '../../shared/types.ts';
import { verifyHmacSignature } from './security.ts';

const app = express();
app.use(express.json());

const transactionDatabase: any[] = [];

app.post('/api/v1/gateway/route', (req: Request, res: Response): void => {
  const packet: NetworkPacket = req.body;
  
  // 1. Structural Checklist Validation
  if (!packet || !packet.route || !packet.payload) {
    res.status(400).json({ success: false, error: 'Malformed payload network package string.' });
    return;
  }

  // 2. Upstream HMAC Integrity Gate Verification
  const incomingSignature = req.headers['x-signature'] as string;
  const isPayloadAuthentic = verifyHmacSignature(packet.payload, incomingSignature);

  if (!isPayloadAuthentic) {
    res.status(401).json({ 
      success: false, 
      error: 'CRITICAL: Upstream HMAC Verification failed. Tampered or unsigned data dropped!' 
    });
    return;
  }

  // 3. Role-Based Access Control (RBAC) Barriers
  const userRole = req.headers['x-user-role'] as string;
  if (userRole !== 'SYSTEM_ADMIN' && userRole !== 'FINANCIAL_MANAGER') {
    res.status(403).json({
      success: false,
      error: 'SECURITY EXCEPTION: Active role tier has insufficient clearance for ledger modification.'
    });
    return;
  }

  // 4. Secure Processing Path
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Secure OmniCore Gateway active on port 5001`);
});
