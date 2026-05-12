'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const IcBox = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IcClock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

export default function WarehousePage() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [simTime, setSimTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);

  const fetchData = () => {
    fetch('/api/warehouse')
      .then(res => res.json())
      .then(data => {
        setCatalog(data.catalog || []);
        setSimTime(data.simulationTime || '');
        setAlerts(data.alerts || []);
        setIsLoading(false);
      });
    
    fetch('/api/schedules?type=MEAL')
      .then(res => res.json())
      .then(data => setSchedules(data.schedules || []));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleStock = async (id: string, currentStatus: boolean) => {
    const res = await fetch('/api/warehouse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_STOCK', id, status: !currentStatus })
    });
    const data = await res.json();
    setCatalog(data.catalog);
  };

  const updateTime = async (time: string) => {
    setSimTime(time);
    await fetch('/api/warehouse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SET_TIME', time })
    });
  };

  const filtered = catalog.filter(p => 
    (filter === 'all' || p.category === filter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container" style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ marginBottom: 4, display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ color: '#00E676' }}><IcBox/></span> Warehouse Operations
            </h1>
            <p style={{ fontSize: 13, color: 'var(--c-muted)' }}>Control stock levels and simulation time for A-TROS testing.</p>
          </div>
          
          <div style={{ display:'flex', gap:12, alignItems:'center', background:'rgba(255,255,255,0.03)', padding:'8px 16px', borderRadius:12, border:'1px solid var(--c-border)' }}>
            <IcClock/>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <span style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--c-muted)' }}>Simulated Time</span>
              <input 
                type="datetime-local" 
                value={simTime.slice(0,16)} 
                onChange={(e) => updateTime(new Date(e.target.value).toISOString())}
                style={{ background:'transparent', border:'none', color:'var(--c-text)', fontSize:13, fontWeight:600, outline:'none' }}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems:'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)' }}><IcSearch/></span>
            <input 
              placeholder="Search catalog..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--c-border)', color: 'var(--c-text)', outline: 'none' }}
            />
          </div>
          <div className="pill-toggle" style={{ margin:0 }}>
            {['all', 'meals', 'groceries', 'pharmacy'].map(cat => (
              <button key={cat} className={filter === cat ? 'active' : ''} onClick={() => setFilter(cat)}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {isLoading ? (
            [1,2,3,4,5,6].map(i => <div key={i} className="sched-card" style={{ height: 100, animation: 'pulse 1.5s infinite' }} />)
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--c-muted)' }}>No products found.</div>
          ) : filtered.map(p => (
            <div key={p.id} className="sched-card" style={{ padding: 18, border: p.in_stock ? '1px solid var(--c-border)' : '1px solid rgba(255,59,48,0.3)', background: p.in_stock ? '' : 'rgba(255,59,48,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-muted)' }}>{p.brand} · ₹{p.price}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background: p.in_stock ? '#00E676' : '#FF3B30', boxShadow: p.in_stock ? '0 0 10px #00E67666' : '0 0 10px #FF3B3066' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: p.in_stock ? '#00E676' : '#FF3B30' }}>
                    {p.in_stock ? 'IN STOCK' : 'OOS'}
                  </span>
                </div>
                <button 
                  onClick={() => toggleStock(p.id, p.in_stock)}
                  style={{ 
                    padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    background: p.in_stock ? 'rgba(255,59,48,0.1)' : 'rgba(0,230,118,0.1)',
                    color: p.in_stock ? '#FF3B30' : '#00E676',
                    border: `1px solid ${p.in_stock ? 'rgba(255,59,48,0.2)' : 'rgba(0,230,118,0.2)'}`,
                  }}
                >
                  {p.in_stock ? 'Mark OOS' : 'Restock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar for Demand & Alerts */}
      <div style={{ display:'flex', flexDirection:'column', gap:20, alignSelf: 'start', position: 'sticky', top: 32 }}>
        
        {/* CRITICAL PROCUREMENT REQUESTS */}
        <div style={{ background: 'rgba(252,128,25,0.05)', border: '1px solid rgba(252,128,25,0.2)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FC8019', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
             🚨 Procurement Required
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.filter(a => a.reason.includes('A-TROS')).length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--c-muted)' }}>No urgent restock requests.</div>
            ) : alerts.filter(a => a.reason.includes('A-TROS')).map((a, i) => (
              <div key={i} style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: 'var(--c-muted)', marginBottom: 12 }}>Upcoming recurring order will fail.</div>
                <button 
                  onClick={() => toggleStock(a.id, false)}
                  style={{ width: '100%', padding: '8px', borderRadius: 8, background: '#FC8019', border: 'none', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  Confirm Restocked
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Demand Section */}
        <div style={{ background: 'rgba(0,230,118,0.03)', border: '1px solid rgba(0,230,118,0.1)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#00E676', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
             📦 Recurring Demand
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {schedules.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--c-muted)' }}>No active recurring schedules.</div>
            ) : schedules.map((s, i) => (
              <div key={i} style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</span>
                  <span style={{ fontSize: 10, color: '#00E676', fontWeight: 800 }}>{s.time}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--c-muted)' }}>
                  {s.items.map((item:any) => typeof item === 'string' ? item : item.name).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operations Alerts Section */}
        <div style={{ background: 'rgba(255,59,48,0.03)', border: '1px solid rgba(255,59,48,0.1)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FF3B30', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF3B30', animation: 'pulse 1s infinite' }} />
            Operations Alerts
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--c-muted)', textAlign: 'center', padding: '20px 0' }}>No active alerts.</div>
            ) : alerts.map((a, i) => (
              <div key={i} style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-text)', marginBottom: 2 }}>Stockout: {a.name}</div>
                <div style={{ fontSize: 11, color: 'var(--c-muted)', marginBottom: 6 }}>{a.reason}</div>
                <div style={{ fontSize: 10, color: '#FF3B30', fontWeight: 600 }}>{new Date(a.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
