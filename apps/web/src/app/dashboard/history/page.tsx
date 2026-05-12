'use client';
import { useState, useEffect } from 'react';

const IcTruck  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IcBox    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IcMoney  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const IcFork   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><line x1="7" y1="11" x2="7" y2="22"/><path d="M21 15V2s-4 2-4 9v4a2 2 0 002 2h2z"/></svg>;
const IcCart   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const IcSkip   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>;
const IcFilter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IcDownload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

type FilterTab = 'all'|'meal'|'grocery';

type Order = {
  id: string;
  type: string;
  vendorName: string;
  swiggyOrderId: string | null;
  amount: number;
  status: string;
  date: string;
  schedule: { name: string } | null;
};

type Schedule = { type: string; isActive: boolean; totalAmount: number; };

const statusStyle: Record<string,string> = {
  DELIVERED:'success', SKIPPED:'warn', FAILED:'danger', SCHEDULED:'blue', PENDING:'warn', IN_TRANSIT:'blue'
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

export default function HistoryPage() {
  const [tab, setTab]           = useState<FilterTab>('all');
  const [orders, setOrders]     = useState<Order[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/schedules').then(r => r.json()),
    ]).then(([ordData, schedData]) => {
      setTimeout(() => {
        if (ordData.orders) setOrders(ordData.orders);
        if (schedData.schedules) setSchedules(schedData.schedules);
        setIsLoading(false);
      }, 800);
    }).catch(() => setIsLoading(false));
  }, []);

  const filtered     = tab === 'all' ? orders : orders.filter(o => o.type.toLowerCase() === tab);
  // Est. monthly spend from active schedules (same logic as Schedules page)
  const mealSpent    = schedules.filter(s => s.type==='MEAL'    && s.isActive).reduce((n,s) => n + s.totalAmount * 20, 0);
  const grocerySpent = schedules.filter(s => s.type==='GROCERY' && s.isActive).reduce((n,s) => n + s.totalAmount * 20, 0);
  const totalSpent   = mealSpent + grocerySpent;
  const skipped      = orders.filter(o => o.status === 'SKIPPED').length;

  return (
    <div className="page-container" style={{ padding:'32px 36px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div><h1 style={{ marginBottom:4 }}>Order History</h1><p style={{ fontSize:13 }}>A complete log of all automated meals and groceries.</p></div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost hide-on-mobile"><IcFilter/> Filter</button>
          <button className="btn btn-ghost hide-on-mobile"><IcDownload/> Export</button>
        </div>
      </div>

      <div className="stats-grid stats-grid-4" style={{ marginBottom:28 }}>
        {[
          { label:'Est. Meal Spend/mo',    value:isLoading?'-':`₹${mealSpent.toLocaleString()}`,    icon:<IcMoney/>, color:'#FC8019' },
          { label:'Est. Grocery Spend/mo', value:isLoading?'-':`₹${grocerySpent.toLocaleString()}`, icon:<IcFork/>,  color:'#FF9A6C' },
          { label:'Est. Total/mo',         value:isLoading?'-':`₹${totalSpent.toLocaleString()}`,   icon:<IcCart/>,  color:'#00E676' },
          { label:'Scheduled Orders',      value:isLoading?'-':`${orders.filter(o=>o.status==='SCHEDULED').length}`, icon:<IcSkip/>,  color:'#F59E0B' },
        ].map((s,i) => (
          <div key={i} className="stat-card">
            <div style={{ width:36, height:36, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', background:`${s.color}18`, color:s.color, border:`1px solid ${s.color}28`, marginBottom:12 }}>{s.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.color, fontFamily:'Space Grotesk', letterSpacing:'-0.02em', marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:11, color:'var(--c-muted)', letterSpacing:'0.04em', textTransform:'uppercase', fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Spend bar */}
      {!isLoading && totalSpent > 0 && (
        <div className="glass" style={{borderRadius:12,padding:'12px 18px',marginBottom:24,display:'flex',alignItems:'center',gap:14}}>
          <span className="hide-on-mobile" style={{fontSize:11,color:'var(--c-muted)',flexShrink:0,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em'}}>Spend split</span>
          <div style={{flex:1,height:5,borderRadius:3,background:'rgba(255,255,255,0.06)',overflow:'hidden',display:'flex'}}>
            <div style={{width:`${(mealSpent/totalSpent)*100}%`,background:'linear-gradient(90deg,#FC8019,#FF9A6C)',borderRadius:'3px 0 0 3px'}}/>
            <div style={{flex:1,background:'linear-gradient(90deg,#00B85A,#00E676)',borderRadius:'0 3px 3px 0'}}/>
          </div>
          <span style={{fontSize:12,color:'#FC8019',flexShrink:0,fontWeight:700}}>₹{mealSpent.toLocaleString()} meals</span>
          <span style={{fontSize:12,color:'#00E676',flexShrink:0,fontWeight:700}}>₹{grocerySpent.toLocaleString()} grocery</span>
        </div>
      )}

      {/* Filter */}
      <div className="pill-toggle" style={{marginBottom:20}}>
        {([{k:'all',l:'All'},{k:'meal',l:'Meals'},{k:'grocery',l:'Groceries'}] as {k:FilterTab,l:string}[]).map(t => (
          <button key={t.k} className={tab===t.k?'active':''} onClick={()=>setTab(t.k)}>
            {t.l} <span style={{opacity:0.55,fontSize:11,fontWeight:400}}>({isLoading?'…':(t.k==='all'?orders:orders.filter(o=>o.type.toLowerCase()===t.k)).length})</span>
          </button>
        ))}
      </div>

      <div className="sched-list-header" style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr auto auto', gap:16, padding:'8px 16px', marginBottom:4 }}>
        {['','Details','Items','Amount','Status'].map((h,i) => (
          <div key={i} style={{ fontSize:10, fontWeight:700, color:'var(--c-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</div>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {isLoading ? (
          [1,2,3,4].map(i => (
            <div key={i} className="sched-card" style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr auto auto', gap:16, padding:'14px 16px', alignItems:'center', animation:'pulse 1.5s infinite' }}>
              <div style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,0.05)' }}/>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <div style={{ width:120, height:13, borderRadius:4, background:'rgba(255,255,255,0.08)' }}/>
                <div style={{ width:160, height:11, borderRadius:4, background:'rgba(255,255,255,0.04)' }}/>
              </div>
              <div style={{ width:'60%', height:12, borderRadius:4, background:'rgba(255,255,255,0.04)' }}/>
              <div style={{ width:50, height:14, borderRadius:4, background:'rgba(255,255,255,0.06)' }}/>
              <div style={{ width:60, height:22, borderRadius:11, background:'rgba(255,255,255,0.05)' }}/>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'48px 24px',color:'var(--c-muted)',fontSize:14}}>
            No orders found. Create a schedule to get started!
          </div>
        ) : filtered.map(o => {
          const isGrocery = o.type === 'GROCERY';
          const accent = isGrocery ? '#00E676' : '#FC8019';
          const itemsDisplay = o.swiggyOrderId || '—';
          const dateStr = formatDate(o.date);
          const timeStr = new Date(o.date).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
          return (
            <div key={o.id} className="sched-card" style={{display:'grid',gridTemplateColumns:'auto 1fr 1fr auto auto',gap:16,padding:'14px 16px',alignItems:'center'}}>
              <div style={{width:36,height:36,borderRadius:9,flexShrink:0,background:`${accent}12`,display:'flex',alignItems:'center',justifyContent:'center',color:accent,border:`1px solid ${accent}22`}}>
                {isGrocery ? <IcBox/> : <IcTruck/>}
              </div>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{o.vendorName}</div>
                <div style={{fontSize:11,color:'var(--c-muted)',marginTop:2}}>{o.schedule?.name || 'Manual'} · {dateStr} {timeStr}</div>
              </div>
              <div style={{fontSize:12,color:'var(--c-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{itemsDisplay}</div>
              <div style={{fontWeight:700,fontSize:14}}>{o.status!=='SKIPPED'?`₹${o.amount.toLocaleString()}`:'—'}</div>
              <span className={`badge badge-${statusStyle[o.status] || 'warn'}`}>{o.status.replace('_',' ')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
