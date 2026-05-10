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
        if (data.schedules) {
          setSchedules(data.schedules.map((s: any) => ({
            ...s,
            label: s.name,
            displayDays: s.days,
            days: s.days.length===7?'Daily':s.days.join(',')==='Mon,Tue,Wed,Thu,Fri'?'Mon–Fri':s.days.join(', '),
            status: s.isActive ? 'active' : 'paused',
            nextOrder: 'Tomorrow ' + s.time,
            amount: s.totalAmount
          })));
        }
        setIsLoading(false);
      });
  }, []);

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

  return (
    <div style={{padding:'32px 36px'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 style={{marginBottom:4}}>Meal Schedules</h1>
          <p style={{fontSize:13}}>Automate your meals — orders placed automatically on your schedule.</p>
        </div>
        <Link href="/dashboard/schedules/new" className="btn btn-primary"><IcPlus/> New Meal Schedule</Link>
      </div>

      {isLoading && <div style={{color:'var(--c-muted)', padding:'20px 0'}}>Loading schedules...</div>}

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:28}}>
        {[
          {label:'Active Schedules',   value:`${activeCount}`,                   icon:<IcCal/>,   color:'#FC8019'},
          {label:'Total Schedules',    value:`${schedules.length}`,              icon:<IcFork/>,  color:'#87CEFF'},
          {label:'Est. Monthly Spend', value:`₹${monthlyEst.toLocaleString()}`, icon:<IcMoney/>, color:'#00E676'},
        ].map((s,i) => (
          <div key={i} className="stat-card">
            <div style={{width:36,height:36,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',background:`${s.color}18`,color:s.color,border:`1px solid ${s.color}28`,marginBottom:12}}>{s.icon}</div>
            <div style={{fontSize:26,fontWeight:800,color:s.color,fontFamily:'Space Grotesk',letterSpacing:'-0.02em',marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:11,color:'var(--c-muted)',letterSpacing:'0.04em',textTransform:'uppercase',fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Schedules list */}
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {schedules.map(s => (
          <div key={s.id} className="sched-card" style={{opacity:s.status==='paused'?0.72:1,transition:'opacity 0.2s'}}>

            {/* Normal view */}
            {editingId!==s.id && (
              <div style={{padding:'20px 22px'}}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <div style={{width:3,height:44,borderRadius:3,background:'#FC8019',flexShrink:0}}/>
                  <div style={{width:42,height:42,borderRadius:11,flexShrink:0,background:'rgba(252,128,25,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FC8019',border:'1px solid rgba(252,128,25,0.2)'}}><IcFork/></div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                      <span style={{fontWeight:600,fontSize:14}}>{s.name}</span>
                      <span className={`badge badge-${s.status==='active'?'success':'warn'}`}>{s.status}</span>
                    </div>
                    <div style={{color:'var(--c-muted)',fontSize:12}}>{s.restaurant} · {s.time} · {s.days}</div>
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,marginRight:16}}>
                    {s.items.map((item,i) => <span key={i} style={{padding:'3px 10px',borderRadius:6,fontSize:11,background:'rgba(255,255,255,0.04)',border:'1px solid var(--c-border)',color:'var(--c-muted)'}}>{item.name}</span>)}
                  </div>
                  <div style={{textAlign:'right',flexShrink:0,marginRight:12}}>
                    <div style={{fontSize:10,color:'var(--c-muted)',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:3}}>{s.status==='active'?'Next order':'Status'}</div>
                    <div style={{fontSize:13,fontWeight:600}}>{s.status==='active'?s.nextOrder:<span style={{color:'var(--c-yellow)'}}>Paused</span>}</div>
                  </div>
                  <div style={{display:'flex',gap:6,flexShrink:0}}>
                    <button onClick={()=>toggleStatus(s.id)} className="btn btn-ghost" style={{padding:'7px 12px',fontSize:12,gap:6}}>{s.status==='active'?<><IcPause/>Pause</>:<><IcPlay/>Resume</>}</button>
                    <button onClick={()=>openEdit(s)} className="btn btn-ghost" style={{padding:'7px 12px',fontSize:12,gap:6}}><IcEdit/>Edit</button>
                    <button className="btn btn-primary" style={{padding:'7px 12px',fontSize:12,gap:6}} onClick={()=>alert(`Ordering from ${s.restaurant}…`)}><IcTruck/>Order Now</button>
                  </div>
                </div>
              </div>
            )}

            {/* Inline edit */}
            {editingId===s.id && (
              <div>
                <div style={{padding:'14px 22px',background:'rgba(252,128,25,0.07)',borderBottom:'1px solid rgba(252,128,25,0.15)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontWeight:700,fontSize:13,color:'#FC8019',letterSpacing:'0.01em'}}>Editing — {s.name}</span>
                  <button onClick={()=>setEditingId(null)} style={{background:'none',border:'none',color:'var(--c-muted)',cursor:'pointer',display:'flex'}}><IcX/></button>
                </div>
                <div style={{padding:'22px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                  <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:7}}>Schedule Name</label><input value={editForm.name||''} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Work Lunch"/></div>
                    <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:7}}>Restaurant</label><input value={editForm.restaurant||''} onChange={e=>setEditForm(f=>({...f,restaurant:e.target.value}))} placeholder="e.g. Burger King"/></div>
                    <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:7}}>Order Time</label><input type="time" value={editForm.time||''} onChange={e=>setEditForm(f=>({...f,time:e.target.value}))}/></div>
                  </div>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10}}>Repeat On</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:12}}>
                      {ALL_DAYS.map(d => { const sel=(editForm.displayDays||[]).includes(d); return (
                        <button key={d} onClick={()=>toggleEditDay(d)} style={{padding:'8px 12px',borderRadius:8,fontWeight:700,fontSize:12,cursor:'pointer',border:'none',transition:'all 0.15s',background:sel?'rgba(252,128,25,0.18)':'rgba(255,255,255,0.04)',color:sel?'#FC8019':'var(--c-muted)',outline:sel?'1px solid rgba(252,128,25,0.45)':'1px solid var(--c-border)'}}>{d}</button>
                      );})}
                    </div>
                    <div style={{display:'flex',gap:6}}>
                      {[{label:'Weekdays',days:['Mon','Tue','Wed','Thu','Fri']},{label:'Weekends',days:['Sat','Sun']},{label:'Daily',days:ALL_DAYS}].map(p => (
                        <button key={p.label} onClick={()=>setEditForm(f=>({...f,displayDays:p.days}))} style={{padding:'5px 10px',borderRadius:6,fontSize:11,fontWeight:600,background:'rgba(255,255,255,0.04)',border:'1px solid var(--c-border)',color:'var(--c-muted)',cursor:'pointer'}}>{p.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{padding:'14px 22px',borderTop:'1px solid var(--c-border)',display:'flex',gap:8,justifyContent:'flex-end'}}>
                  <button onClick={()=>setEditingId(null)} className="btn btn-ghost" style={{padding:'8px 16px',fontSize:12}}>Cancel</button>
                  <button onClick={saveEdit} className="btn btn-primary" style={{padding:'8px 16px',fontSize:12}}>Save Changes</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add CTA */}
        <div className="sched-card" style={{padding:'28px',textAlign:'center',borderStyle:'dashed',background:'transparent'}}>
          <div style={{width:40,height:40,borderRadius:10,background:'rgba(252,128,25,0.08)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FC8019',margin:'0 auto 12px'}}><IcPlus/></div>
          <div style={{fontWeight:600,fontSize:14,marginBottom:6}}>Add a meal schedule</div>
          <div style={{color:'var(--c-muted)',fontSize:12,marginBottom:16}}>Breakfast, lunch, dinner — any day, any time.</div>
          <Link href="/dashboard/schedules/new" className="btn btn-primary" style={{fontSize:12}}><IcPlus/>Create Schedule</Link>
        </div>
      </div>
    </div>
  );
}
