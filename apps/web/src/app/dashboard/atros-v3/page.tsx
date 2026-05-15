'use client';
import { useState, useEffect, useRef } from 'react';

export default function AtrosV3Page() {
  const [testState, setTestState] = useState<any>({ logs: [], current_os: 'IDLE', isRunning: false, no_response_preference: 'AUTO_EXECUTE' });
  const [showPopup, setShowPopup] = useState<string | null>(null);
  const lastAnsweredLogRef = useRef<string>("");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic Polling Logic: Slow down when IDLE, speed up when RUNNING
  useEffect(() => {
    const poll = async () => {
      try {
        // Skip polling if tab is hidden to save resources
        if (document.visibilityState === 'hidden') return;

        const res = await fetch('/api/test/atros-v3');
        if (res.ok) {
          const data = await res.json();
          setTestState(data);
          
          if (!data.isRunning) {
            setShowPopup(null);
          } else {
            const logs = data.logs || [];
            const latestLog = logs[logs.length - 1] || "";
            let targetPopup: string | null = null;

            if (logs.some((l:string) => l.includes('SENDING NOTIFICATION (T-4hr)')) && data.current_os === 'CREATED') {
              targetPopup = 'T4_NOTIF';
            }
            else if (data.current_os === 'SUBSTITUTE_FOUND') targetPopup = 'SUB_NOTIF';
            else if (data.current_os === 'PARTIAL_ORDER_OPTION') targetPopup = 'NO_SUB_NOTIF';
            else if (data.current_os === 'CONFIRMATION_PENDING') targetPopup = 'T60_NOTIF';
            else if (data.current_os === 'PAYMENT_APPROVAL_REQUIRED') targetPopup = 'PAY_NOTIF';

            if (targetPopup && latestLog !== lastAnsweredLogRef.current) {
              setShowPopup(targetPopup);
            } else {
              setShowPopup(null);
            }
          }
        }
      } catch (e) {}
    };

    // Setup a dynamic interval
    const startPolling = (interval: number) => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(poll, interval);
    };

    // Start with 1.5s interval (Balance between speed and terminal noise)
    startPolling(1500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const runV3 = async () => {
    lastAnsweredLogRef.current = "";
    await fetch('/api/test/atros-v3', { method: 'POST', body: JSON.stringify({ action: 'RESET' }) });
    await fetch('/api/test/atros-v3', { 
      method: 'POST', 
      body: JSON.stringify({ 
        action: 'RUN_PIPELINE', 
        rio: { automation_id: 'V3-TEST-FLOW', items: [{ name: 'Milk' }] } 
      }) 
    });
  };

  const inject = (action: string, value: any) => {
    const currentLatest = testState.logs[testState.logs.length - 1] || "";
    lastAnsweredLogRef.current = currentLatest;
    fetch('/api/test/atros-v3', { method: 'POST', body: JSON.stringify({ action, value }) });
    setShowPopup(null);
  };

  const togglePreference = () => {
    const newVal = testState.no_response_preference === 'AUTO_EXECUTE' ? 'AUTO_CANCEL' : 'AUTO_EXECUTE';
    fetch('/api/test/atros-v3', { method: 'POST', body: JSON.stringify({ action: 'SET_PREFERENCE', value: newVal }) });
  };

  return (
    <div style={{ padding: 40, background: '#050505', minHeight: '100vh', color: '#FFF', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, background: 'linear-gradient(to right, #FC8019, #FF3D00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>A-TROS v3.0 WORKFLOW</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Module-based Logic Simulator with Interactive Notifs</p>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 20px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 2 }}>No-Response Rule</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: testState.no_response_preference === 'AUTO_EXECUTE' ? '#00E676' : '#FF3B30' }}>
                {testState.no_response_preference === 'AUTO_EXECUTE' ? 'AUTO-EXECUTE' : 'AUTO-CANCEL'}
              </div>
            </div>
            <button onClick={togglePreference} style={{ background: '#333', border: 'none', width: 50, height: 26, borderRadius: 13, position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
              <div style={{ position: 'absolute', top: 3, left: testState.no_response_preference === 'AUTO_EXECUTE' ? 26 : 3, width: 20, height: 20, borderRadius: '50%', background: testState.no_response_preference === 'AUTO_EXECUTE' ? '#00E676' : '#FF3B30', transition: '0.3s' }} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40 }}>
          
          <div style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Workflow Execution Log</h2>
              <span style={{ background: 'rgba(252,128,25,0.1)', color: '#FC8019', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{testState.current_os}</span>
            </div>

            <div style={{ height: 500, overflowY: 'auto', background: '#000', borderRadius: 16, padding: 24, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8, border: '1px solid rgba(255,255,255,0.05)' }}>
              {testState.logs.map((log: string, i: number) => (
                <div key={i} style={{ color: log.includes('✅') ? '#00E676' : log.includes('❌') ? '#FF3B30' : log.includes('[OS]') ? '#87CEFF' : log.includes('📱') ? '#FFD700' : '#FFF', opacity: i === testState.logs.length-1 ? 1 : 0.5 }}>{log}</div>
              ))}
              {testState.isRunning && !showPopup && <div style={{ marginTop: 20, color: '#FC8019', fontWeight: 800, animation: 'pulse 2s infinite' }}>⚡ AWAITING SYSTEM INJECTOR...</div>}
              {showPopup && <div style={{ marginTop: 20, color: '#FFD700', fontWeight: 800 }}>📱 NOTIFICATION POP-UP ACTIVE</div>}
            </div>

            <button onClick={runV3} style={{ width: '100%', marginTop: 24, padding: 18, borderRadius: 12, background: '#FC8019', color: '#FFF', border: 'none', fontWeight: 800, cursor: 'pointer' }}>START WORKFLOW SIMULATION</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>WAREHOUSE & SYSTEM INJECTORS</h3>
            <ControlGroup label="T-3D INVENTORY STATUS" onYes={() => inject('injectedInventory', 'available')} onNo={() => inject('injectedInventory', 'out')} active={testState.isRunning && testState.current_os === 'CREATED'} />
            <ControlGroup label="WAREHOUSE PROCUREMENT" onYes={() => inject('injectedProcurement', 'yes')} onNo={() => inject('injectedProcurement', 'no')} active={testState.isRunning && testState.current_os === 'WAREHOUSE_NOTIFIED'} />
            <ControlGroup label="SUBSTITUTE DISCOVERY" onYes={() => inject('injectedSubFound', true)} onNo={() => inject('injectedSubFound', false)} active={testState.isRunning && testState.logs.some((l:any) => l.includes('❌ Procurement Failed'))} />
            <ControlGroup label="PAYMENT OUTCOME" onYes={() => inject('injectedPayment', 'primary_ok')} onNo={() => inject('injectedPayment', 'backup_ok')} active={testState.isRunning && testState.logs.some((l:any) => l.includes('Attempting Primary'))} yesLabel="PRIMARY OK" noLabel="USE BACKUP" />
            <button onClick={() => inject('injectedPayment', 'fail_all')} disabled={!testState.isRunning} style={{ ...btnStyle(testState.isRunning), background: 'rgba(255,59,48,0.1)', color: '#FF3B30', width: '100%' }}>🚨 TRIGGER FULL PAYMENT FAILURE</button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#111', width: 450, padding: 40, borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>📱</div>
            
            {showPopup === 'T4_NOTIF' && (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Order is Ready!</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>Your recurring order for Milk is scheduled. Would you like to edit anything?</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => inject('injectedUserAction', 'CONTINUE')} style={modalBtnStyle(true)}>✅ Continue Flow</button>
                  <button onClick={() => inject('injectedUserAction', 'EDIT')} style={{ ...modalBtnStyle(true), background: 'rgba(255,255,255,0.05)' }}>✏️ Edit Order</button>
                </div>
              </>
            )}

            {showPopup === 'SUB_NOTIF' && (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: '#FFD700' }}>Substitute Found</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>Preferred brand is out, but we found a substitute. How should we proceed?</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button onClick={() => inject('injectedUserDecision', 'SUB')} style={modalBtnStyle(true)}>👍 Use Substitute</button>
                  <button onClick={() => inject('injectedUserDecision', 'WITHOUT')} style={{ ...modalBtnStyle(true), background: 'rgba(255,255,255,0.05)' }}>🛒 Without Item</button>
                  <button onClick={() => inject('injectedUserDecision', 'CANCEL')} style={{ ...modalBtnStyle(true), gridColumn: 'span 2', background: 'rgba(255,59,48,0.1)', color: '#FF3B30' }}>🛑 Cancel Entire Order</button>
                </div>
              </>
            )}

            {showPopup === 'NO_SUB_NOTIF' && (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: '#FF3B30' }}>Item Unavailable</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>No substitutes found. Proceed without this item or cancel the entire order?</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button onClick={() => inject('injectedUserDecision', 'WITHOUT')} style={modalBtnStyle(true)}>🛒 Proceed Without</button>
                  <button onClick={() => inject('injectedUserDecision', 'CANCEL')} style={{ ...modalBtnStyle(true), color: '#FF3B30' }}>🛑 Cancel Order</button>
                </div>
              </>
            )}

            {showPopup === 'T60_NOTIF' && (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Final Confirmation</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>Order placing in 60m. Confirm or cancel now.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button onClick={() => inject('injectedT60Response', 'CONFIRM')} style={modalBtnStyle(true)}>✅ Confirm Order</button>
                  <button onClick={() => inject('injectedT60Response', 'CANCEL')} style={{ ...modalBtnStyle(true), color: '#FF3B30' }}>❌ Cancel Order</button>
                  <button onClick={() => inject('injectedT60Response', 'NONE')} style={{ ...modalBtnStyle(true), gridColumn: 'span 2', background: 'rgba(255,255,255,0.05)', fontSize: 11 }}>⏳ No Response (Will {testState.no_response_preference === 'AUTO_EXECUTE' ? 'Execute' : 'Cancel'})</button>
                </div>
              </>
            )}

            {showPopup === 'PAY_NOTIF' && (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: '#FF3B30' }}>Payment Required</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>All payment attempts failed. Please authorize manually.</p>
                <button onClick={() => inject('injectedPayment', 'primary_ok')} style={{ ...modalBtnStyle(true), width: '100%' }}>💳 Authorize Now</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ControlGroup({ label, onYes, onNo, active, yesLabel="AVAILABLE", noLabel="OUT OF STOCK" }: any) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
      <label style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 12 }}>{label}</label>
      <div style={{ display: 'flex', gap: 10 }}>
        <button disabled={!active} onClick={onYes} style={btnStyle(active)}>✅ {yesLabel}</button>
        <button disabled={!active} onClick={onNo} style={{ ...btnStyle(active), color: '#FF3B30' }}>❌ {noLabel}</button>
      </div>
    </div>
  );
}

function btnStyle(active: boolean) {
  return { flex: 1, padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: 10, fontWeight: 700, cursor: active ? 'pointer' : 'default', opacity: active ? 1 : 0.3 };
}

function modalBtnStyle(active: boolean) {
  return { flex: 1, padding: '16px', borderRadius: 12, background: '#FC8019', border: 'none', color: '#FFF', fontSize: 13, fontWeight: 800, cursor: 'pointer' };
}
