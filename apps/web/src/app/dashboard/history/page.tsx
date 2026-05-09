'use client';
import { useState } from 'react';

const IcTruck  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IcBox    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IcMoney  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const IcFork   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><line x1="7" y1="11" x2="7" y2="22"/><path d="M21 15V2s-4 2-4 9v4a2 2 0 002 2h2z"/></svg>;
const IcCart   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const IcSkip   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>;

type FilterTab = 'all'|'meal'|'grocery';

const mockOrders = [
  {id:'o1',type:'meal',    restaurant:'Burger King',     items:'Whopper + Fries',             amount:349,  status:'DELIVERED', date:'Today',       time:'1:02 PM',  scheduleLabel:'Work Lunch'},
  {id:'o2',type:'meal',    restaurant:'Subway',           items:'Veg Delight Sub',             amount:219,  status:'DELIVERED', date:'Today',       time:'8:35 AM',  scheduleLabel:'Daily Breakfast'},
  {id:'o3',type:'grocery', restaurant:'Swiggy Instamart', items:'Rice 5kg, Dal 2kg, Oil 1L…', amount:1240, status:'DELIVERED', date:'Yesterday',   time:'10:20 AM', scheduleLabel:'Monthly Kitchen Essentials'},
  {id:'o4',type:'meal',    restaurant:'Burger King',     items:'Whopper',                     amount:249,  status:'DELIVERED', date:'Yesterday',   time:'1:00 PM',  scheduleLabel:'Work Lunch'},
  {id:'o5',type:'grocery', restaurant:'Swiggy Instamart', items:'Tomatoes 1kg, Milk 2L…',    amount:380,  status:'DELIVERED', date:'Sat, May 3',  time:'11:00 AM', scheduleLabel:'Weekly Fresh Produce'},
  {id:'o6',type:'meal',    restaurant:'Pizza Hut',        items:'Margherita + Garlic Bread',  amount:599,  status:'DELIVERED', date:'Mon, May 6',  time:'7:30 PM',  scheduleLabel:'Weekend Dinner'},
  {id:'o7',type:'meal',    restaurant:'Burger King',     items:'Whopper + Fries',             amount:349,  status:'SKIPPED',   date:'Sun, May 5',  time:'1:00 PM',  scheduleLabel:'Work Lunch'},
  {id:'o8',type:'grocery', restaurant:'Swiggy Instamart', items:'Spinach 500g, Curd 400g…',  amount:280,  status:'SKIPPED',   date:'Sat, Apr 26', time:'11:00 AM', scheduleLabel:'Weekly Fresh Produce'},
];

export default function HistoryPage() {
  const [tab, setTab] = useState<FilterTab>('all');
  const filtered     = tab==='all' ? mockOrders : mockOrders.filter(o=>o.type===tab);
  const mealSpent    = mockOrders.filter(o=>o.type==='meal'    && o.status==='DELIVERED').reduce((s,o)=>s+o.amount,0);
  const grocerySpent = mockOrders.filter(o=>o.type==='grocery' && o.status==='DELIVERED').reduce((s,o)=>s+o.amount,0);
  const totalSpent   = mealSpent+grocerySpent;
  const skipped      = mockOrders.filter(o=>o.status==='SKIPPED').length;

  const statusStyle: Record<string,string> = {DELIVERED:'success',SKIPPED:'warn',FAILED:'danger',IN_TRANSIT:'blue'};

  return (
    <div style={{padding:'32px 36px'}}>
      <h1 style={{marginBottom:4}}>Order History</h1>
      <p style={{fontSize:13,marginBottom:28}}>All your automated meals and grocery deliveries in one place.</p>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
        {[
          {label:'Total Spend',   value:`₹${totalSpent.toLocaleString()}`,   icon:<IcMoney/>, color:'#FC8019'},
          {label:'Meal Spend',    value:`₹${mealSpent.toLocaleString()}`,    icon:<IcFork/>,  color:'#FF9A6C'},
          {label:'Grocery Spend', value:`₹${grocerySpent.toLocaleString()}`, icon:<IcCart/>,  color:'#00E676'},
          {label:'Skipped',       value:`${skipped}`,                         icon:<IcSkip/>,  color:'#F59E0B'},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div style={{width:36,height:36,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',background:`${s.color}18`,color:s.color,border:`1px solid ${s.color}28`,marginBottom:12}}>{s.icon}</div>
            <div style={{fontSize:26,fontWeight:800,color:s.color,fontFamily:'Space Grotesk',letterSpacing:'-0.02em',marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:11,color:'var(--c-muted)',letterSpacing:'0.04em',textTransform:'uppercase',fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Spend bar */}
      <div className="glass" style={{borderRadius:12,padding:'12px 18px',marginBottom:24,display:'flex',alignItems:'center',gap:14}}>
        <span style={{fontSize:11,color:'var(--c-muted)',flexShrink:0,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em'}}>Spend split</span>
        <div style={{flex:1,height:5,borderRadius:3,background:'rgba(255,255,255,0.06)',overflow:'hidden',display:'flex'}}>
          <div style={{width:`${(mealSpent/totalSpent)*100}%`,background:'linear-gradient(90deg,#FC8019,#FF9A6C)',borderRadius:'3px 0 0 3px'}}/>
          <div style={{flex:1,background:'linear-gradient(90deg,#00B85A,#00E676)',borderRadius:'0 3px 3px 0'}}/>
        </div>
        <span style={{fontSize:12,color:'#FC8019',flexShrink:0,fontWeight:700}}>₹{mealSpent.toLocaleString()} meals</span>
        <span style={{fontSize:12,color:'#00E676',flexShrink:0,fontWeight:700}}>₹{grocerySpent.toLocaleString()} grocery</span>
      </div>

      {/* Filter */}
      <div className="pill-toggle" style={{marginBottom:20}}>
        {([{k:'all',l:'All'},{k:'meal',l:'Meals'},{k:'grocery',l:'Groceries'}] as {k:FilterTab,l:string}[]).map(t=>(
          <button key={t.k} className={tab===t.k?'active':''} onClick={()=>setTab(t.k)}>
            {t.l} <span style={{opacity:0.55,fontSize:11,fontWeight:400}}>({(t.k==='all'?mockOrders:mockOrders.filter(o=>o.type===t.k)).length})</span>
          </button>
        ))}
      </div>

      {/* Table header */}
      <div style={{display:'grid',gridTemplateColumns:'auto 1fr 1fr auto auto',gap:16,padding:'8px 16px',marginBottom:4}}>
        {['','Restaurant / Schedule','Items','Amount','Status'].map((h,i)=>(
          <div key={i} style={{fontSize:10,fontWeight:700,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</div>
        ))}
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {filtered.map(o=>{
          const isGrocery = o.type==='grocery';
          const accent = isGrocery?'#00E676':'#FC8019';
          return (
            <div key={o.id} className="sched-card" style={{display:'grid',gridTemplateColumns:'auto 1fr 1fr auto auto',gap:16,padding:'14px 16px',alignItems:'center'}}>
              <div style={{width:36,height:36,borderRadius:9,flexShrink:0,background:`${accent}12`,display:'flex',alignItems:'center',justifyContent:'center',color:accent,border:`1px solid ${accent}22`}}>
                {isGrocery ? <IcBox/> : <IcTruck/>}
              </div>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{o.restaurant}</div>
                <div style={{fontSize:11,color:'var(--c-muted)',marginTop:2}}>{o.scheduleLabel} · {o.date} {o.time}</div>
              </div>
              <div style={{fontSize:12,color:'var(--c-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.items}</div>
              <div style={{fontWeight:700,fontSize:14}}>{o.status!=='SKIPPED'?`₹${o.amount.toLocaleString()}`:'—'}</div>
              <span className={`badge badge-${statusStyle[o.status]}`}>{o.status.replace('_',' ')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
