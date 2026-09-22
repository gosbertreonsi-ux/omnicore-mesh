import React, { useState } from 'react';
import { sendAiPrompt, dispatchSecureTransaction } from './apiService.ts';

export const OverwatchDashboard: React.FC = () => {
  const [activeRole, setActiveRole] = useState<string>('SYSTEM_ADMIN');
  const [signatureToken, setSignatureToken] = useState<string>('616b48c300c86b5b5a1e7133c55f1e16a891b4f9eb99f92c448c309ed363fa35');
  const [logs, setLogs] = useState<any[]>([
    { time: new Date().toLocaleTimeString(), status: 'INFO', msg: 'Core routing node connection established.' },
    { time: new Date().toLocaleTimeString(), status: 'INFO', msg: 'HMAC validation buffer initialized [SHA-256 enabled].' }
  ]);
  const [aiPromptText, setAiPromptText] = useState<string>('Please process a payment request of 650 dollars');
  const [lastAiOutput, setLastAiOutput] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleExecuteTransaction = async () => {
    setIsProcessing(true);
    const packetToDispatch = lastAiOutput ? lastAiOutput.generatedPacket : {
      route: '/api/v1/payments/settle',
      payload: { amount: 650, currency: 'USD', merchantId: 'merchant_skyconnect_global', status: 'PENDING', timestamp: new Date().toISOString(), transactionId: 'tx_ui_fallback' }
    };

    const res = await dispatchSecureTransaction(packetToDispatch, signatureToken, activeRole);
    const time = new Date().toLocaleTimeString();
    
    setTimeout(() => {
      if (res.success) {
        setLogs(prev => [{ time, status: 'SUCCESS', msg: `Routed: ${res.message} -> Index [${res.ledgerIndex.transactionId || res.ledgerIndex.id}]` }, ...prev]);
      } else {
        setLogs(prev => [{ time, status: 'CRITICAL', msg: `${res.error}` }, ...prev]);
      }
      setIsProcessing(false);
    }, 400);
  };

  const handleAiOrchestration = async () => {
    const res = await sendAiPrompt(aiPromptText);
    const time = new Date().toLocaleTimeString();
    if (res.success) {
      setLastAiOutput(res.orchestration);
      setSignatureToken(res.orchestration.generatedPacket.signature);
      setLogs(prev => [{ time, status: 'AI_SWARM', msg: `Intercepted intent: ${res.orchestration.intentIdentified} mapped to ${res.orchestration.agentName}` }, ...prev]);
    } else {
      setLogs(prev => [{ time, status: 'CRITICAL', msg: `Orchestration Failure: ${res.error}` }, ...prev]);
    }
  };

    return (
    <div style={{
      boxSizing: 'border-box',
      backgroundColor: '#05070B',
      color: '#F8FAFC',
      fontFamily: '"SF Mono", "Fira Code", Menlo, monospace',
      padding: '32px',
      minHeight: '100vh',
      letterSpacing: '-0.02em',
      background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent), radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.05), transparent), #05070B'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: '24px', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.3)' }}>SYSTEM ONLINE</span>
            <span style={{ fontSize: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366F1', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(99, 102, 241, 0.3)' }}>CORE v24.14</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '8px 0 0 0', color: '#FFFFFF', letterSpacing: '-0.03em' }}>OMNICORE MESH</h1>
          <p style={{ color: '#475569', fontSize: '12px', margin: '4px 0 0 0' }}>SkyConnect Telemetry Router Infrastructure Console</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase' }}>Active Gateway Route</div>
            <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 'bold' }}>PORT 5001 // SECURE</div>
          </div>
          <div style={{ borderLeft: '1px solid #1E293B', height: '32px' }}></div>
          <div>
            <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>RBAC Barrier Context</div>
            <select 
              value={activeRole} 
              onChange={(e) => setActiveRole(e.target.value)}
              style={{ backgroundColor: '#0F172A', color: '#F1F5F9', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', outline: 'none' }}
            >
              <option value="SYSTEM_ADMIN">🛡️ root@admin_tier</option>
              <option value="FINANCIAL_MANAGER">💼 finance@clearance_med</option>
              <option value="STANDARD_USER">👤 guest@unprivileged_view</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        <div style={{ boxSizing: 'border-box', backgroundColor: '#0F172A', border: '1px solid #1E293B', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', margin: 0, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cryptographic Validation Gate</h3>
              <span style={{ fontSize: '11px', color: '#475569' }}>HMAC-SHA256</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Inbound Header Token (x-signature)</label>
              <input 
                type="text" 
                value={signatureToken}
                onChange={(e) => setSignatureToken(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', backgroundColor: '#05070B', border: '1px solid #1E293B', color: '#34D399', borderRadius: '6px', fontSize: '12px', outline: 'none', wordBreak: 'break-all' }}
              />
            </div>
          </div>

          <button 
            onClick={handleExecuteTransaction}
            disabled={isProcessing}
            style={{ width: '100%', backgroundColor: isProcessing ? '#1E293B' : '#10B981', color: '#05070B', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.02em' }}
          >
            {isProcessing ? '::: TRANSMITTING DATA :::' : '⚡ Settle Inbound Gateway Payload'}
          </button>
        </div>

        <div style={{ boxSizing: 'border-box', backgroundColor: '#0F172A', border: '1px solid #1E293B', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', margin: 0, color: '#A855F7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Multi-Agent Intent Interceptor</h3>
              <span style={{ fontSize: '11px', color: '#475569' }}>Eve AI Core</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Unstructured Telemetry Prompt Stream</label>
              <input 
                type="text" 
                value={aiPromptText}
                onChange={(e) => setAiPromptText(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', backgroundColor: '#05070B', border: '1px solid #1E293B', color: '#F472B6', borderRadius: '6px', fontSize: '12px', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <button 
              onClick={handleAiOrchestration}
              style={{ width: '100%', backgroundColor: '#6366F1', color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: lastAiOutput ? '16px' : '0px' }}
            >
              🧠 Evaluate & Compute Data Models
            </button>

            {lastAiOutput && (
              <div style={{ backgroundColor: 'rgba(5, 7, 11, 0.6)', border: '1px solid #1E293B', padding: '12px 16px', borderRadius: '6px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#A855F7', fontWeight: 'bold' }}>SWARM: {lastAiOutput.agentName}</span>
                  <span style={{ color: '#10B981', fontWeight: 'bold' }}>CONFIDENCE: {Math.round(lastAiOutput.confidenceScore * 100)}%</span>
                </div>
                <div style={{ color: '#64748B' }}>INTENT REF: <span style={{ color: '#38BDF8' }}>{lastAiOutput.intentIdentified}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ boxSizing: 'border-box', marginTop: '32px', backgroundColor: '#0F172A', border: '1px solid #1E293B', padding: '24px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', margin: 0, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Real-Time Routing Ledger Index</h3>
          <span style={{ height: '8px', width: '8px', backgroundColor: '#10B981', borderRadius: '50%', boxShadow: '0 0 8px #10B981' }}></span>
        </div>

        <div style={{ backgroundColor: '#05070B', border: '1px solid #1E293B', padding: '20px', borderRadius: '6px', minHeight: '200px', maxHeight: '350px', overflowY: 'auto' }}>
          {logs.map((log, index) => {
            let badgeColor = '#64748B';
            let bgBadge = 'rgba(100, 116, 139, 0.1)';
            if (log.status === 'SUCCESS') { badgeColor = '#10B981'; bgBadge = 'rgba(16, 185, 129, 0.1)'; }
            if (log.status === 'CRITICAL') { badgeColor = '#EF4444'; bgBadge = 'rgba(239, 68, 68, 0.1)'; }
            if (log.status === 'AI_SWARM') { badgeColor = '#A855F7'; bgBadge = 'rgba(168, 85, 247, 0.1)'; }

            return (
              <div key={index} style={{ fontSize: '12px', display: 'flex', gap: '16px', marginBottom: '10px', borderBottom: '1px solid #0F172A', paddingBottom: '8px', alignItems: 'flex-start', flexWrap: 'nowrap' }}>
                <span style={{ color: '#334155', whiteSpace: 'nowrap' }}>[{log.time}]</span>
                <span style={{ color: badgeColor, backgroundColor: bgBadge, padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: `1px solid ${badgeColor}33`, whiteSpace: 'nowrap' }}>{log.status}</span>
                <span style={{ color: log.status === 'CRITICAL' ? '#FCA5A5' : '#E2E8F0', lineHeight: '1.4', wordBreak: 'break-all' }}>{log.msg}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
