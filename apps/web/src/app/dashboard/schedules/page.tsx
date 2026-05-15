'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const IcFork    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><line x1="7" y1="11" x2="7" y2="22"/><path d="M21 15V2s-4 2-4 9v4a2 2 0 002 2h2z"/></svg>;
const IcMoney   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const IcPlus    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcX       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

type Schedule = {
  id: string;
  name: string;
  restaurant: string;
  time: string;
  days: string;
  status: string;
  nextOrder: string;
  items: {name:string; price:number}[];
  totalAmount: number;
  isActive: boolean;
};

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [simulatingId, setSimulatingId] = useState<string|null>(null);
  const [showSim, setShowSim] = useState(false);
  const [testState, setTestState] = useState<any>({ logs: [], current_os: 'IDLE', isRunning: false });

  useEffect(() => {
    fetch('/api/schedules?type=MEAL')
      .then(res => res.json())
      .then(data => {
        if (data.schedules) {
          setSchedules(data.schedules.map((s:any) => ({
            ...s,
            status: s.isActive ? 'active' : 'paused',
            nextOrder: 'Today ' + s.time
          })));
        } else {
          setSchedules([
            { id: 'demo-1', name: 'Office Lunch', restaurant: 'Social', time: '13:00', days: 'Mon–Fri', status: 'active', nextOrder: 'Today 13:00', items: [{name: 'Chicken Biryani', price: 350}], totalAmount: 350, isActive: true },
            { id: 'demo-2', name: 'Gym Dinner', restaurant: 'Healthie', time: '20:30', days: 'Daily', status: 'active', nextOrder: 'Today 20:30', items: [{name: 'Paneer Bowl', price: 280}], totalAmount: 280, isActive: true }
          ]);
        }
        setIsLoading(false);
      }).catch(() => {
        setSchedules([
          { id: 'demo-1', name: 'Office Lunch', restaurant: 'Social', time: '13:00', days: 'Mon–Fri', status: 'active', nextOrder: 'Today 13:00', items: [{name: 'Chicken Biryani', price: 350}], totalAmount: 350, isActive: true },
          { id: 'demo-2', name: 'Gym Dinner', restaurant: 'Healthie', time: '20:30', days: 'Daily', status: 'active', nextOrder: 'Today 20:30', items: [{name: 'Paneer Bowl', price: 280}], totalAmount: 280, isActive: true }
        ]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!showSim) return;
    const poll = async () => {
      try {
        const res = await fetch('/api/test/atros');
        if (res.ok) {
          const data = await res.json();
          setTestState(data);
        }
      } catch (e) {}
    };
    poll();
    const interval = setInterval(poll, 800);
    return () => clearInterval(interval);
  }, [showSim]);

  const runSimulation = async (schedule: Schedule) => {
    // 1. Reset
    await fetch('/api/test/atros', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'RESET', value: null }) });
    
    // 2. Open Console
    setSimulatingId(schedule.id);
    setShowSim(true);
    
    // 3. Start Pipeline
    const rioMock = {
      automation_id: schedule.id,
      user_id: 'user-trial',
      category: 'meals',
      items: schedule.items,
      budget_rules: { total_budget: 1000, per_item_cap: 500, price_flex_pct: 20, allow_other_brands: true, continue_without: true }
    };

    fetch('/api/atros/run', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ rio: rioMock }) 
    }).then(() => setSimulatingId(null));
  };

  const sendTestControl = async (action: string, value: any) => {
    const res = await fetch('/api/test/atros', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, value }) 
    });
    if (res.ok) {
      const data = await res.json();
      setTestState(data.state);
    }
  };

  const activeCount = schedules.filter(s => s.status==='active').length;
  const monthlyEst  = schedules.filter(s => s.status==='active').reduce((sum,s) => sum + s.totalAmount * 20, 0);

  return (
    <div className="page-container" style={{ padding:'32px 36px', maxWidth: 1200, margin: '0 auto', color: '#FFFFFF' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div><h1 style={{ marginBottom:4, color: '#FFFFFF' }}>Meal Schedules</h1><p style={{ fontSize:13, color: 'rgba(255,255,255,0.6)' }}>Automate your meals — orders placed automatically on your schedule.</p></div>
        <Link href="/dashboard/schedules/new" className="btn btn-primary hide-on-mobile"><IcPlus/> New Meal Schedule</Link>
      </div>

      <div className="stats-grid stats-grid-2" style={{ marginBottom:28 }}>
        {[
          { label:'Active Schedules', value:isLoading?'-':`${activeCount}`, icon:<IcFork/>, color:'#FC8019' },
          { label:'Monthly Estimated', value:isLoading?'-':`₹${monthlyEst.toLocaleString()}`, icon:<IcMoney/>, color:'#00E676' },
        ].map((s,i) => (
          <div key={i} className="stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: 24, borderRadius: 20 }}>
            <div style={{ width:36, height:36, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', background:`${s.color}18`, color:s.color, border:`1px solid ${s.color}28`, marginBottom:12 }}>{s.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:'0.04em', textTransform:'uppercase', fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap:20 }}>
        {schedules.map(s => (
          <div key={s.id} style={{ padding: 24, borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom: 16 }}>
              <div style={{ width:42, height:42, borderRadius:11, background:'rgba(252,128,25,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#FC8019', border:'1px solid rgba(252,128,25,0.2)' }}><IcFork/></div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom: 2 }}>
                  <span style={{ fontWeight:600, fontSize:15, color: '#FFF' }}>{s.name}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: s.status==='active'?'rgba(0,230,118,0.1)':'rgba(255,152,0,0.1)', color: s.status==='active'?'#00E676':'#FF9800' }}>{s.status}</span>
                </div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{s.restaurant}</div>
              </div>
            </div>
            <button onClick={() => runSimulation(s)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background:'linear-gradient(135deg, #FC8019 0%, #D35400 100%)', border: 'none', color: '#FFF', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              {simulatingId === s.id ? 'Starting Pipeline...' : 'Test A-TROS'}
            </button>
          </div>
        ))}
      </div>

      {showSim && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.95)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(10px)' }}>
          <div style={{ width: 850, padding: 40, borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', background: '#080808', display:'flex', gap:40, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            
            {/* Left: Console Logs */}
            <div style={{ flex: 1.2 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#FFF' }}>A-TROS Live Console</h2>
                <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: 'rgba(252,128,25,0.1)', color: '#FC8019', fontWeight: 700 }}>{testState.current_os}</span>
              </div>
              
              <div style={{ background:'#000', borderRadius: 16, padding: 24, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8, height: 460, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column', gap: 12 }}>
                {testState.logs.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)' }}>Waiting for engine initialization...</div>}
                {testState.logs.map((log: string, i: number) => (
                  <div key={i} style={{ color: log.includes('✅') || log.includes('SUCCESS') ? '#00E676' : log.includes('❌') ? '#FF3B30' : log.includes('STATE') ? '#87CEFF' : '#FFFFFF', opacity: i === (testState.logs.length - 1) ? 1 : 0.5 }}>{log}</div>
                ))}
                {testState.isRunning && (
                  <div style={{ marginTop: 12, padding: 14, background: 'rgba(252,128,25,0.05)', border: '1px dashed rgba(252,128,25,0.2)', borderRadius: 12, color: '#FC8019', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
                    ⚡ AWAITING YOUR INPUT
                  </div>
                )}
              </div>
              <button onClick={() => { setShowSim(false); sendTestControl('RESET', null); }} style={{ width: '100%', marginTop: 24, padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', cursor: 'pointer' }}>Close Console</button>
            </div>

            {/* Right: Controls */}
            <div style={{ flex: 0.8, background: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: 28, border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: 12, fontWeight: 800, marginBottom: 24, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>TEST INJECTORS</h3>
              
              <div style={{ display:'flex', flexDirection:'column', gap: 28 }}>
                <Section label="INVENTORY GATE" onYes={() => sendTestControl('SET_INVENTORY', 'available')} onNo={() => sendTestControl('SET_INVENTORY', 'out')} active={testState.isRunning} />
                <Section label="PROCUREMENT" onYes={() => sendTestControl('SET_PROCUREMENT', 'confirmed')} onNo={() => sendTestControl('SET_PROCUREMENT', 'failed')} active={testState.isRunning} />
                <Section label="SUBSTITUTION" onYes={() => sendTestControl('SET_SUB_FOUND', true)} onNo={() => sendTestControl('SET_SUB_FOUND', false)} active={testState.isRunning} />
                
                <div>
                  <label style={{ fontSize:10, fontWeight:800, display:'block', marginBottom:12, color:'rgba(255,255,255,0.4)' }}>USER DECISION</label>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <button disabled={!testState.isRunning} onClick={() => sendTestControl('SET_USER_RESPONSE', 'CONFIRM')} style={btnStyle(testState.isRunning)}>✅ CONFIRM</button>
                    <button disabled={!testState.isRunning} onClick={() => sendTestControl('SET_USER_RESPONSE', 'SKIP')} style={btnStyle(testState.isRunning)}>⏭ SKIP</button>
                  </div>
                </div>

                <Section label="PAYMENT" onYes={() => sendTestControl('SET_PAYMENT', 'success')} onNo={() => sendTestControl('SET_PAYMENT', 'fail_primary')} active={testState.isRunning} yesLabel="SUCCESS" noLabel="FAIL PRIMARY" />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function Section({ label, onYes, onNo, active, yesLabel="SUCCESS", noLabel="FAILURE" }: any) {
  return (
    <div>
      <label style={{ fontSize:10, fontWeight:800, display:'block', marginBottom:12, color:'rgba(255,255,255,0.4)' }}>{label}</label>
      <div style={{ display:'flex', gap:10 }}>
        <button disabled={!active} onClick={onYes} style={btnStyle(active)}>✅ {yesLabel}</button>
        <button disabled={!active} onClick={onNo} style={{ ...btnStyle(active), color: '#FF3B30' }}>❌ {noLabel}</button>
      </div>
    </div>
  );
}

function btnStyle(active: boolean) {
  return {
    flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: 10, fontWeight: 700, cursor: active ? 'pointer' : 'default', opacity: active ? 1 : 0.3
  };
}
