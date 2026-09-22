import React, { useState, useEffect } from 'react';
import { UserRole, TransactionPayload } from '../../shared/types';

export const OverwatchDashboard: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>('SYSTEM_ADMIN');
  const [logs, setLogs] = useState<string[]>([]);
  const [systemConnected, setSystemConnected] = useState<boolean>(true);

  // Simulating live telemetry log pipelines
  useEffect(() => {
    const logInterval = setInterval(() => {
      const liveEvents = [
        "Inbound JSON validation success on path /api/v1/gateway",
        "HMAC Key handshake verification passed",
        "Deterministic JSON structure matched AI Multi-Agent engine schema",
        "Transaction ledger sync matching PostgreSQL state index"
      ];
      const randomLog = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      setLogs((prev) => [ `[${new Date().toLocaleTimeString()}] ${randomLog}`, ...prev.slice(0, 4) ]);
    }, 3000);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div style={{ backgroundColor: '#0B0F19', color: '#E2E8F0', fontFamily: 'monospace', padding: '24px', minHeight: '100vh' }}>
      {/* Header telemetry band */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ color: '#38BDF8', margin: 0 }}>🚀 OmniCore Mesh Overwatch Portal</h1>
          <p style={{ color: '#64748B', margin: '4px 0 0 0' }}>SkyConnect PT Presentation Baseline</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            System Gateway Status: 
            <span style={{ color: systemConnected ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
              {systemConnected ? ' ● ONLINE' : ' ○ DISCONNECTED'}
            </span>
          </div>
          <select 
            value={activeRole} 
            onChange={(e) => setActiveRole(e.target.value as UserRole)}
            style={{ backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #38BDF8', padding: '6px', borderRadius: '4px' }}
          >
            <option value="SYSTEM_ADMIN">Role: System Admin</option>
            <option value="FINANCIAL_MANAGER">Role: Financial Manager</option>
            <option value="DATA_ANALYST">Role: Data Analyst</option>
          </select>
        </div>
      </div>

      {/* Main UI layout matrices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Module Area 1: Access Control Metric Details */}
        <div style={{ backgroundColor: '#111827', border: '1px solid #1E293B', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: '#F59E0B', marginTop: 0 }}>🛡️ Active Scope Constraints</h3>
          <p>Current Security Layer Context: <strong>{activeRole}</strong></p>
          <ul>
            <li>Ledger DB Path Access: {activeRole === 'SYSTEM_ADMIN' || activeRole === 'FINANCIAL_MANAGER' ? 'ALLOWED ✅' : 'RESTRICTED ❌'}</li>
            <li>Route Modification Capability: {activeRole === 'SYSTEM_ADMIN' ? 'ALLOWED ✅' : 'RESTRICTED ❌'}</li>
            <li>Data Analytics Visualization: 'ALLOWED ✅'</li>
          </ul>
        </div>

        {/* Module Area 2: Live Log Pipeline Stream */}
        <div style={{ backgroundColor: '#111827', border: '1px solid #1E293B', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: '#38BDF8', marginTop: 0 }}>📊 Core Event Log Stream</h3>
          <div style={{ backgroundColor: '#030712', padding: '12px', borderRadius: '6px', minHeight: '120px' }}>
            {logs.map((log, index) => (
              <div key={index} style={{ fontSize: '12px', color: '#A7F3D0', marginBottom: '6px' }}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
