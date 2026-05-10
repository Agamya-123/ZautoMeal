'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ── SVG Icons ────────────────────────────────────────────── */
const IcMoney   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const IcFork    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><line x1="7" y1="11" x2="7" y2="22"/><path d="M21 15V2s-4 2-4 9v4a2 2 0 002 2h2z"/></svg>;
const IcCart    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const IcClock   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcTruck   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IcBox     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IcCal     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>;
const IcPlus    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcArrow   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

const mockOrders = [
  { id:'o1', type:'meal',    restaurant:'Burger King',     items:'Whopper + Fries',             amount:349,  status:'DELIVERED', date:'Today',       time:'1:02 PM'  },
  { id:'o2', type:'meal',    restaurant:'Subway',           items:'Veg Delight Sub',             amount:219,  status:'DELIVERED', date:'Today',       time:'8:35 AM'  },
  { id:'o3', type:'grocery', restaurant:'Swiggy Instamart', items:'Rice 5kg, Dal 2kg, Oil…',    amount:1240, status:'DELIVERED', date:'Yesterday',   time:'10:20 AM' },
  { id:'o4', type:'meal',    restaurant:'Burger King',     items:'Whopper',                     amount:249,  status:'DELIVERED', date:'Yesterday',   time:'1:00 PM'  },
];

type Filter = 'all' | 'meal' | 'grocery';

export default function DashboardPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter]       = useState<Filter>('all');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders]       = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/schedules').then(r => r.json()),
      fetch('/api/orders').then(r => r.json()),
    ]).then(([schedData, ordData]) => {
      setTimeout(() => {
        if (schedData.schedules) {
          setSchedules(schedData.schedules.map((s: any) => ({
            id: s.id,
            type: s.type.toLowerCase(),
            label: s.name,
            restaurant: s.restaurant,
            time: s.time || (s.type==='GROCERY'?'11:00 AM':''),
            days: s.days.length===7?'Daily':s.days.join(','),
            status: s.isActive ? 'active' : 'paused',
            nextOrder: 'Tomorrow',
            rawTotalAmount: s.totalAmount || 0,
          })));
        }
        if (ordData.orders) setOrders(ordData.orders);
        setIsLoading(false);
      }, 800);
    });
  }, []);

  const filteredOrders    = filter === 'all' ? orders    : orders.filter((o: any) => o.type.toLowerCase() === filter);
  const filteredSchedules = filter === 'all' ? schedules : schedules.filter(s => s.type === filter);

  // Estimated monthly spend derived from schedule totalAmount (same as Schedules page)
  const estSpend = (f: string) => schedules
    .filter(s => s.status === 'active' && (f === 'all' || s.type === f))
    .reduce((sum: number, s: any) => sum + (s.rawTotalAmount || 0) * 20, 0);
  const mealSpent    = estSpend('meal');
  const grocerySpent = estSpend('grocery');
  const totalSpent   = estSpend(filter === 'all' ? 'all' : filter);

  const statCards = filter === 'all'
    ? [
        { label:'Est. Monthly Spend', value:isLoading?'-':`₹${estSpend('all').toLocaleString()}`, icon:<IcMoney/>,  color:'#FC8019' },
        { label:'Meal Schedules',     value:isLoading?'-':`${schedules.filter(s=>s.type==='meal'&&s.status==='active').length}`, icon:<IcFork/>,   color:'#FF9A6C' },
        { label:'Grocery Schedules',  value:isLoading?'-':`${schedules.filter(s=>s.type==='grocery'&&s.status==='active').length}`, icon:<IcCart/>,   color:'#00E676' },
        { label:'Hours Saved',        value:isLoading?'-':`${schedules.filter(s=>s.status==='active').length * 5}`,                icon:<IcClock/>,  color:'#87CEFF' },
      ]
    : [
        { label: filter==='meal' ? 'Est. Meal Spend/mo' : 'Est. Grocery Spend/mo', value:isLoading?'-':`₹${totalSpent.toLocaleString()}`, icon: filter==='meal'?<IcFork/>:<IcCart/>, color: filter==='meal'?'#FC8019':'#00E676' },
        { label:'Active Schedules', value:isLoading?'-':`${filteredSchedules.filter((s:any)=>s.status==='active').length}`, icon:<IcCal/>,   color:'#87CEFF' },
        { label:'Recent Orders',    value:isLoading?'-':`${filteredOrders.length}`,                                          icon:<IcTruck/>, color:'#FF9A6C' },
        { label:'Hours Saved',      value:isLoading?'-':`${filteredSchedules.filter((s:any)=>s.status==='active').length * 5}`, icon:<IcClock/>, color:'#A78BFA' },
      ];

  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh' }}>

      {/* ── Header ───────────────────────────────────────── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div>
          <h1 style={{ marginBottom:4 }}>Good afternoon, Agamya</h1>
          <p style={{ fontSize:13 }}>Your automated food &amp; grocery hub</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ gap:8 }}>
          <IcPlus /> New Schedule
        </button>
      </div>

      {/* ── Filter toggle ─────────────────────────────────── */}
      <div className="pill-toggle" style={{ marginBottom:24 }}>
        {(['all','meal','grocery'] as Filter[]).map(f => (
          <button key={f} className={filter===f?'active':''} onClick={() => setFilter(f)}>
            {f==='all' ? 'All' : f==='meal' ? 'Meals' : 'Groceries'}
          </button>
        ))}
      </div>

      {/* ── Stat cards ───────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 }}>
        {statCards.map((s,i) => (
          <div key={i} className="stat-card animate-fade-up" style={{ animationDelay:`${i*0.05}s` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ width:36, height:36, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', background:`${s.color}18`, color:s.color, border:`1px solid ${s.color}28` }}>{s.icon}</div>
            </div>
            <div style={{ fontSize:26, fontWeight:800, color:s.color, fontFamily:'Space Grotesk', letterSpacing:'-0.02em', marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:11, color:'var(--c-muted)', letterSpacing:'0.04em', textTransform:'uppercase', fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Spend split bar ──────────────────────────────── */}
      {filter === 'all' && (
        <div className="glass" style={{ borderRadius:12, padding:'12px 18px', marginBottom:24, display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:11, color:'var(--c-muted)', flexShrink:0, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em' }}>Spend</span>
          <div style={{ flex:1, height:5, borderRadius:3, background:'rgba(255,255,255,0.06)', overflow:'hidden', display:'flex' }}>
            <div style={{ width:`${(mealSpent/(mealSpent+grocerySpent))*100}%`, background:'linear-gradient(90deg,#FC8019,#FF9A6C)', borderRadius:'3px 0 0 3px', transition:'width 0.4s' }}/>
            <div style={{ flex:1, background:'linear-gradient(90deg,#00B85A,#00E676)', borderRadius:'0 3px 3px 0' }}/>
          </div>
          <span style={{ fontSize:12, color:'#FC8019', flexShrink:0, fontWeight:700 }}>₹{mealSpent.toLocaleString()} meals</span>
          <span style={{ fontSize:12, color:'#00E676', flexShrink:0, fontWeight:700 }}>₹{grocerySpent.toLocaleString()} grocery</span>
        </div>
      )}

      {/* ── Schedules section ────────────────────────────── */}
      <section style={{ marginBottom:28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <h2>Your Schedules</h2>
          <Link href={filter==='grocery'?'/dashboard/groceries':'/dashboard/schedules'} style={{ display:'flex', alignItems:'center', gap:5, color:'var(--c-orange)', fontSize:12, fontWeight:600, textDecoration:'none' }}>
            View all <IcArrow/>
          </Link>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {isLoading ? (
            [1,2,3].map(i => (
              <div key={i} className="sched-card" style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:14, animation:'pulse 1.5s infinite' }}>
                <div style={{ width:3, height:40, borderRadius:3, background:'rgba(255,255,255,0.05)', flexShrink:0 }}/>
                <div style={{ width:40, height:40, borderRadius:10, flexShrink:0, background:'rgba(255,255,255,0.05)' }}/>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ width:120, height:14, borderRadius:4, background:'rgba(255,255,255,0.08)' }}/>
                  <div style={{ width:180, height:12, borderRadius:4, background:'rgba(255,255,255,0.04)' }}/>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, marginRight:12 }}>
                  <div style={{ width:40, height:10, borderRadius:3, background:'rgba(255,255,255,0.04)' }}/>
                  <div style={{ width:80, height:12, borderRadius:3, background:'rgba(255,255,255,0.08)' }}/>
                </div>
                <div style={{ width:50, height:22, borderRadius:11, background:'rgba(255,255,255,0.05)' }}/>
              </div>
            ))
          ) : filteredSchedules.map(s => {
            const isGrocery = s.type === 'grocery';
            const accent = isGrocery ? '#00E676' : '#FC8019';
            return (
              <div key={s.id} className="sched-card">
                <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px' }}>
                  {/* Accent bar */}
                  <div style={{ width:3, height:40, borderRadius:3, background:accent, flexShrink:0 }}/>
                  {/* Icon */}
                  <div style={{ width:40, height:40, borderRadius:10, flexShrink:0, background:`${accent}14`, display:'flex', alignItems:'center', justifyContent:'center', color:accent, border:`1px solid ${accent}22` }}>
                    {isGrocery ? <IcCart/> : <IcFork/>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <span style={{ fontWeight:600, fontSize:14 }}>{s.label}</span>
                      <span className={`badge badge-${isGrocery?'success':'orange'}`}>{s.type}</span>
                    </div>
                    <div style={{ color:'var(--c-muted)', fontSize:12 }}>{s.restaurant} · {s.time} · {s.days}</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0, marginRight:12 }}>
                    <div style={{ fontSize:10, color:'var(--c-muted)', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:3 }}>Next</div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{s.nextOrder}</div>
                  </div>
                  <span className={`badge badge-${s.status==='active'?'success':'warn'}`}>{s.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Recent Orders ────────────────────────────────── */}
      <section>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <h2>Recent Orders</h2>
          <Link href="/dashboard/history" style={{ display:'flex', alignItems:'center', gap:5, color:'var(--c-orange)', fontSize:12, fontWeight:600, textDecoration:'none' }}>
            View all <IcArrow/>
          </Link>
        </div>

        {/* Table header */}
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr auto auto', gap:16, padding:'8px 16px', marginBottom:4 }}>
          {['','Restaurant','Items','Amount','Status'].map((h,i) => (
            <div key={i} style={{ fontSize:10, fontWeight:700, color:'var(--c-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {isLoading ? (
            [1,2].map(i => (
              <div key={i} className="sched-card" style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr auto auto', gap:16, padding:'14px 16px', alignItems:'center', animation:'pulse 1.5s infinite' }}>
                <div style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,0.05)' }}/>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ width:100, height:13, borderRadius:4, background:'rgba(255,255,255,0.08)' }}/>
                  <div style={{ width:130, height:11, borderRadius:4, background:'rgba(255,255,255,0.04)' }}/>
                </div>
                <div style={{ width:'60%', height:12, borderRadius:4, background:'rgba(255,255,255,0.04)' }}/>
                <div style={{ width:50, height:14, borderRadius:4, background:'rgba(255,255,255,0.06)' }}/>
                <div style={{ width:60, height:22, borderRadius:11, background:'rgba(255,255,255,0.05)' }}/>
              </div>
            ))
          ) : filteredOrders.slice(0, 4).map((o: any) => (
            <div key={o.id} className="sched-card" style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr auto auto', gap:16, padding:'14px 16px', alignItems:'center' }}>
              <div style={{ width:34, height:34, borderRadius:9, flexShrink:0, background: o.type==='MEAL'?'rgba(252,128,25,0.1)':'rgba(0,230,118,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color: o.type==='MEAL'?'#FC8019':'#00E676', border:`1px solid ${o.type==='MEAL'?'rgba(252,128,25,0.2)':'rgba(0,230,118,0.2)'}` }}>
                {o.type==='MEAL' ? <IcTruck/> : <IcBox/>}
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{o.vendorName}</div>
                <div style={{ fontSize:11, color:'var(--c-muted)', marginTop:2 }}>{o.schedule?.name || 'Manual'} · {new Date(o.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
              </div>
              <div style={{ fontSize:12, color:'var(--c-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.swiggyOrderId || '—'}</div>
              <div style={{ fontWeight:700, fontSize:14, color:'var(--c-text)' }}>₹{o.amount.toLocaleString()}</div>
              <span className={`badge badge-${o.status==='DELIVERED'?'success':o.status==='SCHEDULED'?'blue':'warn'}`}>{o.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── New Schedule Modal ─────────────────────────────── */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div className="glass" onClick={e => e.stopPropagation()} style={{ borderRadius:22, padding:'36px', maxWidth:420, width:'100%', border:'1px solid var(--c-border-bright)', boxShadow:'0 24px 80px rgba(0,0,0,0.6)' }}>
            <h2 style={{ textAlign:'center', marginBottom:6, fontSize:20 }}>Create a Schedule</h2>
            <p style={{ textAlign:'center', fontSize:13, marginBottom:28 }}>What would you like to automate?</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { icon:<IcFork/>, label:'Meal Schedule',    desc:'Auto-order breakfast, lunch, or dinner on your chosen days', href:'/dashboard/schedules/new', bg:'rgba(252,128,25,0.08)', border:'rgba(252,128,25,0.25)', accent:'#FC8019' },
                { icon:<IcCart/>, label:'Grocery Schedule', desc:'Weekly or monthly grocery delivery via Swiggy Instamart',     href:'/dashboard/groceries/new',  bg:'rgba(0,230,118,0.06)', border:'rgba(0,230,118,0.25)', accent:'#00E676' },
              ].map(opt => (
                <button key={opt.href} onClick={() => { setShowModal(false); router.push(opt.href); }}
                  style={{ display:'flex', alignItems:'center', gap:16, padding:'18px 20px', borderRadius:14, cursor:'pointer', textAlign:'left', background:opt.bg, border:`1px solid ${opt.border}`, color:'var(--c-text)', width:'100%', transition:'all var(--transition)' }}>
                  <div style={{ width:48, height:48, borderRadius:13, background:`${opt.accent}20`, display:'flex', alignItems:'center', justifyContent:'center', color:opt.accent, flexShrink:0, border:`1px solid ${opt.accent}30` }}>{opt.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{opt.label}</div>
                    <div style={{ color:'var(--c-muted)', fontSize:12, lineHeight:1.4 }}>{opt.desc}</div>
                  </div>
                  <span style={{ color:opt.accent, flexShrink:0 }}><IcArrow/></span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowModal(false)} style={{ marginTop:16, width:'100%', padding:'10px', borderRadius:10, background:'transparent', border:'1px solid var(--c-border)', color:'var(--c-muted)', cursor:'pointer', fontSize:13, fontFamily:'Inter' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
