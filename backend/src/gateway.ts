import express, { Request, Response, NextFunction } from 'express';
import { NetworkPacket, UserRole } from '../../shared/types';

const app = express();
app.use(express.json());

// Mock DB Storage array for presentation simulation
const transactionDatabase: any[] = [];

// API Route Handler simulating SkyPay Engine logic
app.post('/api/v1/gateway/route', (req: Request, res: Response): void => {
  const packet: NetworkPacket = req.body;

  if (!packet.route || !packet.payload) {
    res.status(400).json({ success: false, error: 'Malformed payload network package string.' });
    return;
  }

  // Simulate routing tasks and state mutations
  const { transactionId, amount, currency, status } = packet.payload;
  
  const record = {
    id: `tx_${Math.random().toString(36).substr(2, 9)}`,
    transactionId,
    amount,
    currency,
    status,
    timestamp: new Date().toISOString()
  };

  transactionDatabase.push(record);
  
  res.status(200).json({
    success: true,
    message: 'Event safely routed through Node.js Gateway Logic.',
    dispatchedRoute: packet.route,
    ledgerIndex: record
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 OmniCore Gateway active on port ${PORT}`);
});
