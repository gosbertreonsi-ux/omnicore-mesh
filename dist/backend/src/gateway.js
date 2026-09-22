"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Mock DB Storage array for presentation simulation
const transactionDatabase = [];
// API Route Handler simulating SkyPay Engine logic
app.post('/api/v1/gateway/route', (req, res) => {
    const packet = req.body;
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
