'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const IcFork    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><line x1="7" y1="11" x2="7" y2="22"/><path d="M21 15V2s-4 2-4 9v4a2 2 0 002 2h2z"/></svg>;
const IcCal     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>;
const IcMoney   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const IcPlus    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcPause   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>;
const IcPlay    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IcEdit    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcTruck   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IcX       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcClock   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ALL_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

type Schedule = {
  id: string;
  name: string;
  restaurant: string;
  time: string;
  days: string[];
  displayDays: string[];
  status: string;
  nextOrder: string;
  items: {name:string; price:number}[];
  totalAmount: number;
  isActive: boolean;
};

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [editForm,  setEditForm]  = useState<Partial<Schedule>>({});

  useEffect(() => {
    fetch('/api/schedules?type=MEAL')
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          if (data.schedules) {
            setSchedules(data.schedules.map((s: any) => {
              const now = new Date();
              const [h, m] = s.time.split(':').map(Number);
              const daysMap: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
              const scheduledDays = Array.isArray(s.days) ? s.days.map((d:string) => daysMap[d]) : [];
              
              const currentDay = now.getDay();
              const scheduledToday = new Date();
              scheduledToday.setHours(h, m, 0);

              const isScheduledToday = scheduledDays.includes(currentDay) && scheduledToday > now;
              let nextDateLabel = isScheduledToday ? 'Today ' : 'Tomorrow ';
              
              // If it's not today or tomorrow, just show the next day name if possible
              if (!isScheduledToday && !scheduledDays.includes((currentDay + 1) % 7)) {
                nextDateLabel = 'Next Order '; 
              }

              return {
                ...s,
                displayDays: Array.isArray(s.days) ? s.days : [],
                days: !Array.isArray(s.days) ? 'Not Set' : s.days.length===7 ? 'Daily' : s.days.join(',')==='Mon,Tue,Wed,Thu,Fri' ? 'Mon–Fri' : s.days.join(', '),
                status: s.isActive ? 'active' : 'paused',
                nextOrder: nextDateLabel + s.time,
                amount: s.totalAmount
              };
            }));
          }
          setIsLoading(false);
        }, 800);
      });
  }, []);

  const [simulatingId, setSimulatingId] = useState<string|null>(null);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [showSim, setShowSim] = useState(false);

  const runSimulation = async (schedule: Schedule) => {
    setSimulatingId(schedule.id);
    setSimLog(['🔄 Initiating A-TROS Pipeline...', '📅 Target: ' + new Date().toLocaleString()]);
    setShowSim(true);
    
    try {
      const catRes = await fetch('/api/warehouse');
      const { catalog } = await catRes.json();
      setSimLog(prev => [...prev, '📦 Warehouse Catalog synced (50 items)']);

      const rioMock = {
        automation_id: schedule.id,
        user_id: 'user-trial',
        category: 'meals',
        items: schedule.items.map(i => {
          const match = catalog.find((p:any) => p.name === i.name);
          return {
            item_id: match ? match.id : i.name.toUpperCase().replace(/\s+/g, '_'),
            name: i.name,
            qty: 1,
            preferred_brand: schedule.restaurant,
            last_known_price: i.price,
            category_tags: ['meal', 'ready-to-eat'],
            dietary_tags: [],
            blacklisted_brands: []
          };
        }),
        budget_rules: {
          total_budget: 1000,
          per_item_cap: 500,
          price_flex_pct: 20,
          allow_other_brands: true,
          continue_without: true,
          auto_accept_sub: false,
          budget_alert_pct: 80
        },
        notification_prefs: ['whatsapp'],
        platform: 'swiggy'
      };

      setSimLog(prev => [...prev, '🔍 Checking stock for ' + schedule.items.length + ' items...']);
      
      // GRANULAR CHECK FOR DEMO INTERACTION
      for (const item of schedule.items) {
        const match = catalog.find((p:any) => p.name.toLowerCase() === item.name.toLowerCase());
        if (match && !match.in_stock) {
          setSimLog(prev => [...prev, `🚨 ALERT: ${item.name} is OUT OF STOCK!`]);
          setSimLog(prev => [...prev, `💬 Sending WhatsApp recovery options to user...`]);
          
          // WAIT for user interaction
          const decision = await new Promise((resolve) => {
            const handleDecision = (d: string) => resolve(d);
            // This is a bit of a hack to wait for UI interaction
            (window as any).resolveAtrosDecision = handleDecision;
          });

          setSimLog(prev => [...prev, `👤 User response received: ${decision}`]);
          if (decision === 'REJECT') {
             setSimLog(prev => [...prev, '❌ Order Cancelled by user.']);
             setSimulatingId(null);
             return;
          }
        } else {
          setSimLog(prev => [...prev, `✅ ${item.name} is in stock.`]);
        }
      }

      const res = await fetch('/api/atros/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rio: rioMock })
      });
      const result = await res.json();
      
      setSimLog(prev => [...prev, 
        result.outcome === 'SUCCESS' ? '🚀 PIPELINE COMPLETE: Order Placed!' : '⚠️ ' + result.outcome + ': Pipeline finished.',
        '📝 Log: ' + result.message
      ]);
    } catch (e) {
      setSimLog(prev => [...prev, '❌ Error: Pipeline failed to execute.']);
    } finally {
      setSimulatingId(null);
    }
  };

  const activeCount = schedules.filter(s => s.status==='active').length;
  const monthlyEst  = schedules.filter(s => s.status==='active').reduce((sum,s) => sum + s.totalAmount * 20, 0);

  const toggleStatus = (id:string) => setSchedules(p => p.map(s => s.id===id ? {...s, status:s.status==='active'?'paused':'active'} : s));

  const openEdit = (s:Schedule) => { setEditingId(s.id); setEditForm({name:s.name, restaurant:s.restaurant, time:s.time, displayDays:[...s.displayDays]}); };
  const toggleEditDay = (d:string) => setEditForm(f => { const c=f.displayDays||[]; return {...f, displayDays:c.includes(d)?c.filter(x=>x!==d):[...c,d]}; });
  const saveEdit = () => {
    setSchedules(p => p.map(s => {
      if (s.id!==editingId) return s;
      const days = editForm.displayDays||s.displayDays;
      const label = days.length===7?'Daily':days.join('')==='MonTueWedThuFri'?'Mon–Fri':days.join('')==='SatSun'?'Sat–Sun':days.join(', ');
      return {...s,...editForm,displayDays:days,days:label};
    }));
    setEditingId(null);
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    try {
      const res = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSchedules(p => p.filter(s => s.id !== id));
        setEditingId(null);
      } else {
        alert('Failed to delete schedule');
      }
    } catch (e) {
      alert('Error deleting schedule');
    }
  };

  return (
    <div className="page-container" style={{ padding:'32px 36px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div><h1 style={{ marginBottom:4 }}>Meal Schedules</h1><p style={{ fontSize:13 }}>Automate your meals — orders placed automatically on your schedule.</p></div>
        <Link href="/dashboard/schedules/new" className="btn btn-primary hide-on-mobile"><IcPlus/> New Meal Schedule</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid stats-grid-3">
        {[
          { label:'Active Schedules', value:isLoading?'-':`${schedules.filter(s=>s.status==='active').length}`, icon:<IcClock/>, color:'#87CEFF' },
          { label:'Total Schedules',  value:isLoading?'-':`${schedules.length}`,                                icon:<IcCal/>,   color:'#A78BFA' },
          { label:'Est. Monthly Spend',value:isLoading?'-':`₹${Math.round(monthlyEst).toLocaleString()}`,    icon:<IcMoney/>, color:'#FC8019' },
        ].map((s,i) => (
          <div key={i} className="stat-card">
            <div style={{ width:36, height:36, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', background:`${s.color}18`, color:s.color, border:`1px solid ${s.color}28`, marginBottom:12 }}>{s.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.color, fontFamily:'Space Grotesk', letterSpacing:'-0.02em', marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:11, color:'var(--c-muted)', letterSpacing:'0.04em', textTransform:'uppercase', fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {isLoading ? (
          [1,2].map(i => (
            <div key={i} className="sched-card" style={{ padding:'20px 22px', display:'flex', alignItems:'center', gap:14, animation:'pulse 1.5s infinite' }}>
              <div className="hide-on-mobile" style={{ width:3, height:44, borderRadius:3, background:'rgba(255,255,255,0.05)' }}/>
              <div style={{ width:42, height:42, borderRadius:11, background:'rgba(255,255,255,0.05)' }}/>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{ width:160, height:14, borderRadius:4, background:'rgba(255,255,255,0.08)' }}/>
                <div style={{ width:200, height:12, borderRadius:4, background:'rgba(255,255,255,0.04)' }}/>
              </div>
              <div className="hide-on-mobile" style={{ width:100, height:22, borderRadius:6, background:'rgba(255,255,255,0.04)', marginRight:16 }}/>
              <div className="hide-on-mobile" style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, marginRight:12 }}>
                <div style={{ width:50, height:10, borderRadius:3, background:'rgba(255,255,255,0.04)' }}/>
                <div style={{ width:90, height:12, borderRadius:3, background:'rgba(255,255,255,0.08)' }}/>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <div style={{ width:70, height:28, borderRadius:6, background:'rgba(255,255,255,0.05)' }}/>
                <div style={{ width:60, height:28, borderRadius:6, background:'rgba(255,255,255,0.05)' }}/>
              </div>
            </div>
          ))
        ) : schedules.map((s,i) => (
          <div key={s.id} className="sched-card animate-fade-up" style={{ animationDelay:`${i*0.05}s`, opacity:s.status==='paused'?0.6:1 }}>

            {editingId !== s.id && (
              <div style={{ padding:'20px 22px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div className="hide-on-mobile" style={{ width:3, height:44, borderRadius:3, background:'#FC8019', flexShrink:0 }}/>
                  <div style={{ width:42, height:42, borderRadius:11, flexShrink:0, background:'rgba(252,128,25,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#FC8019', border:'1px solid rgba(252,128,25,0.2)' }}><IcFork/></div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <span style={{ fontWeight:600, fontSize:14 }}>{s.name}</span>
                      <span className={`badge badge-${s.status==='active'?'success':'warn'} hide-on-mobile`}>{s.status}</span>
                    </div>
                    <div style={{ color:'var(--c-muted)', fontSize:12 }}>{s.restaurant} · {s.time} <span className="hide-on-mobile">· {s.days}</span></div>
                  </div>
                  <div className="hide-on-mobile" style={{ display:'flex', flexWrap:'wrap', gap:6, marginRight:16, maxWidth:200 }}>
                    {s.items.slice(0,2).map((item:any,idx:number)=><span key={idx} style={{ padding:'3px 10px', borderRadius:6, fontSize:11, background:'rgba(255,255,255,0.04)', border:'1px solid var(--c-border)', color:'var(--c-muted)' }}>{typeof item === 'object' ? item.name : item}</span>)}
                    {s.items.length>2 && <span style={{ padding:'3px 10px', borderRadius:6, fontSize:11, background:'rgba(255,255,255,0.02)', color:'var(--c-muted)' }}>+{s.items.length-2} more</span>}
                  </div>
                  <div className="hide-on-mobile" style={{ textAlign:'right', flexShrink:0, marginRight:12 }}>
                    <div style={{ fontSize:10, color:'var(--c-muted)', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:3 }}>{s.status==='active'?'Next order':'Status'}</div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{s.status==='active'?s.nextOrder:<span style={{ color:'var(--c-yellow)' }}>Paused</span>}</div>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button 
                      onClick={() => runSimulation(s)}
                      disabled={simulatingId === s.id}
                      className="btn"
                      style={{ 
                        padding:'6px 12px', 
                        fontSize:11, 
                        background:simulatingId === s.id ? 'rgba(255,255,255,0.05)' : 'rgba(135,206,255,0.1)', 
                        color:simulatingId === s.id ? 'var(--c-muted)' : '#87CEFF',
                        border: '1px solid rgba(135,206,255,0.2)',
                        borderRadius:6,
                        fontWeight:600,
                        cursor: simulatingId === s.id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {simulatingId === s.id ? 'Running...' : 'Test A-TROS'}
                    </button>
                    <button onClick={()=>toggleStatus(s.id)} className="btn btn-ghost" style={{ padding:'7px 12px', fontSize:12, gap:6 }}>{s.status==='active'?<><IcPause/>Pause</>:<><IcPlay/>Resume</>}</button>
                    <button onClick={()=>openEdit(s)} className="btn btn-ghost" style={{ padding:'7px 12px', fontSize:12, gap:6 }}><IcEdit/>Edit</button>
                    <button className="btn btn-primary hide-on-mobile" style={{ padding:'7px 12px', fontSize:12 }} onClick={()=>alert(`Ordering ${s.name} now...`)}>Order Now</button>
                  </div>
                </div>
              </div>
            )}

            {editingId === s.id && (
              <div>
                <div style={{ padding:'14px 22px', background:'rgba(252,128,25,0.06)', borderBottom:'1px solid rgba(252,128,25,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:700, fontSize:13, color:'#FC8019', letterSpacing:'0.01em' }}>Editing — {s.name}</span>
                  <button onClick={()=>setEditingId(null)} style={{ background:'none', border:'none', color:'var(--c-muted)', cursor:'pointer', display:'flex' }}><IcX/></button>
                </div>
                <div style={{ padding:'22px' }}>
                  <div className="stats-grid stats-grid-2" style={{ gap:20 }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                      <div><label className="section-label">Schedule Name</label><input value={editForm.name||''} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))}/></div>
                      <div><label className="section-label">Restaurant</label><input value={editForm.restaurant||''} onChange={e=>setEditForm(f=>({...f,restaurant:e.target.value}))}/></div>
                      <div><label className="section-label">Order Time</label><input type="time" value={editForm.time||''} onChange={e=>setEditForm(f=>({...f,time:e.target.value}))}/></div>
                    </div>
                    <div>
                      <label className="section-label">Repeat On</label>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
                        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => {
                          const active = editForm.days?.includes(day);
                          return (
                            <button key={day} onClick={()=>{
                              const ds=editForm.days||[]; setEditForm(f=>({...f,days:active?ds.filter(d=>d!==day):[...ds,day]}));
                            }} style={{ width:34, height:34, borderRadius:10, fontSize:12, fontWeight:600, border:'1px solid', borderColor:active?'#FC8019':'var(--c-border)', background:active?'rgba(252,128,25,0.15)':'rgba(255,255,255,0.04)', color:active?'#FC8019':'var(--c-muted)', cursor:'pointer', transition:'all 0.15s' }}>{day[0]}</button>
                          );
                        })}
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>setEditForm(f=>({...f,days:['Mon','Tue','Wed','Thu','Fri']}))} className="btn btn-ghost" style={{ flex:1, fontSize:11, padding:'6px' }}>Weekdays</button>
                        <button onClick={()=>setEditForm(f=>({...f,days:['Sat','Sun']}))} className="btn btn-ghost" style={{ flex:1, fontSize:11, padding:'6px' }}>Weekends</button>
                        <button onClick={()=>setEditForm(f=>({...f,days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']}))} className="btn btn-ghost" style={{ flex:1, fontSize:11, padding:'6px' }}>Daily</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ padding:'14px 22px', borderTop:'1px solid var(--c-border)', display:'flex', justifyContent:'space-between' }}>
                  <button onClick={()=>deleteSchedule(s.id)} className="btn btn-ghost" style={{ padding:'8px 16px', fontSize:12, color:'var(--c-red)', borderColor:'rgba(248,113,113,0.2)' }}>Delete Schedule</button>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={()=>setEditingId(null)} className="btn btn-ghost" style={{ padding:'8px 16px', fontSize:12 }}>Cancel</button>
                    <button onClick={saveEdit} className="btn btn-primary" style={{ padding:'8px 16px', fontSize:12 }}>Save Changes</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {!isLoading && (
          <div className="sched-card" style={{ padding:'28px', textAlign:'center', borderStyle:'dashed', background:'transparent' }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'rgba(252,128,25,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'#FC8019', margin:'0 auto 12px' }}><IcPlus/></div>
            <div style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>Add a meal schedule</div>
            <div style={{ color:'var(--c-muted)', fontSize:12, marginBottom:16 }}>Breakfast, lunch, dinner — any day, any time.</div>
            <Link href="/dashboard/schedules/new" className="btn btn-primary" style={{ fontSize:12 }}><IcPlus/>Create Schedule</Link>
          </div>
        )}
      </div>
      {/* Simulation Result Overlay */}
      {showSim && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.8)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
          <div className="glass" style={{ width: 500, padding: 32, borderRadius: 24, border: '1px solid var(--c-border)', background: '#0A0A0A' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>A-TROS Live Execution</h2>
              <button onClick={() => setShowSim(false)} style={{ background:'none', border:'none', color:'var(--c-muted)', cursor:'pointer' }}><IcX/></button>
            </div>
            
            <div style={{ background:'rgba(0,0,0,0.4)', borderRadius: 12, padding: 20, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, maxHeight: 300, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column', gap: 8 }}>
              {simLog.map((log, i) => (
                <div key={i} style={{ color: log.includes('✅') || log.includes('SUCCESS') ? '#00E676' : log.includes('🚨') || log.includes('❌') ? '#FF3B30' : 'var(--c-text)' }}>
                  {log}
                </div>
              ))}
              {simulatingId && <div style={{ color:'#FC8019', animation:'pulse 1s infinite' }}>▋ Processing...</div>}
              
              {/* INTERACTIVE WHATSAPP BUBBLE */}
              {simLog.some(l => l.includes('💬')) && !simLog.some(l => l.includes('👤')) && (
                <div style={{ marginTop: 20, padding: '16px', background: '#075E54', borderRadius: '12px 12px 12px 0', position: 'relative', alignSelf: 'flex-start', maxWidth: '90%', animation: 'slideIn 0.3s ease-out' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#25D366', marginBottom: 6 }}>ZAUTOMEAL RECOVERY</div>
                  <div style={{ fontSize: 13, color: '#fff', marginBottom: 12 }}>
                    One or more items are out of stock. We found premium substitutes within your budget. Would you like to proceed?
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      onClick={() => (window as any).resolveAtrosDecision('ACCEPT')}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#25D366', border: 'none', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Accept Substitutes
                    </button>
                    <button 
                      onClick={() => (window as any).resolveAtrosDecision('REJECT')}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel Order
                    </button>
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'right', marginTop: 8 }}>11:59 PM ✓✓</div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowSim(false)}
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: 24, justifyContent: 'center' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
