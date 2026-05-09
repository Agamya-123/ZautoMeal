'use client';
import { useState } from 'react';
import Link from 'next/link';

const IcCart    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const IcMoney   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const IcBox     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IcPlus    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcPause   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>;
const IcPlay    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IcEdit    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcX       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const DAYS_OF_WEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const popularBundles = [
  {icon:<IcBox/>,  name:'Kitchen Staples',  items:'Rice, Dal, Oil, Spices',     price:'₹1,200–1,500',freq:'Monthly'},
  {icon:<IcBox/>,  name:'Daily Dairy',      items:'Milk, Curd, Butter, Paneer', price:'₹600–800',    freq:'Weekly'},
  {icon:<IcCart/>, name:'Fresh Veggies',    items:'Seasonal vegetables, Herbs', price:'₹300–500',    freq:'Weekly'},
  {icon:<IcBox/>,  name:'Home Essentials',  items:'Soap, Shampoo, Detergent',   price:'₹800–1,200',  freq:'Monthly'},
];

const initialSchedules = [
  {id:'g1',label:'Monthly Kitchen Essentials',frequency:'Monthly',dayOfMonth:1,dayOfWeek:'Saturday',nextDelivery:'1st Jun 2026',items:['Basmati Rice 5kg','Toor Dal 2kg','Mustard Oil 1L','Sugar 2kg','Salt 1kg'],amount:1240,store:'Swiggy Instamart',status:'active',alertBefore:'1440'},
  {id:'g2',label:'Weekly Fresh Produce',       frequency:'Weekly', dayOfMonth:1,dayOfWeek:'Saturday',nextDelivery:'Sat, 10 May', items:['Tomatoes 1kg','Onions 1kg','Spinach 500g','Milk 2L','Curd 400g'],             amount:380, store:'Swiggy Instamart',status:'active',alertBefore:'1440'},
];
type GrocSched = typeof initialSchedules[0];

export default function GroceriesPage() {
  const [activeTab,  setActiveTab]  = useState<'schedules'|'bundles'>('schedules');
  const [schedules,  setSchedules]  = useState(initialSchedules);
  const [editingId,  setEditingId]  = useState<string|null>(null);
  const [editForm,   setEditForm]   = useState<Partial<GrocSched>>({});
  const [newItem,    setNewItem]    = useState('');

  const toggleStatus = (id:string) => setSchedules(p=>p.map(s=>s.id===id?{...s,status:s.status==='active'?'paused':'active'}:s));
  const openEdit     = (s:GrocSched) => { setEditingId(s.id); setEditForm({label:s.label,frequency:s.frequency,dayOfMonth:s.dayOfMonth,dayOfWeek:s.dayOfWeek,items:[...s.items],alertBefore:s.alertBefore}); };
  const saveEdit     = () => { setSchedules(p=>p.map(s=>s.id!==editingId?s:{...s,...editForm})); setEditingId(null); };
  const addItem      = () => { if(!newItem.trim())return; setEditForm(f=>({...f,items:[...(f.items||[]),newItem.trim()]})); setNewItem(''); };
  const removeItem   = (i:number) => setEditForm(f=>({...f,items:(f.items||[]).filter((_,idx)=>idx!==i)}));

  return (
    <div style={{padding:'32px 36px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div><h1 style={{marginBottom:4}}>Grocery Schedules</h1><p style={{fontSize:13}}>Auto-deliver weekly or monthly groceries via Swiggy Instamart.</p></div>
        <Link href="/dashboard/groceries/new" className="btn btn-green"><IcPlus/> New Grocery Schedule</Link>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:28}}>
        {[
          {label:'Active Schedules',           value:`${schedules.filter(s=>s.status==='active').length}`, icon:<IcCart/>,  color:'#00E676'},
          {label:"This Month's Spend",          value:'₹1,620',                                             icon:<IcMoney/>, color:'#FC8019'},
          {label:'Items on Auto-order',         value:`${schedules.reduce((n,s)=>n+s.items.length,0)}`,   icon:<IcBox/>,   color:'#87CEFF'},
        ].map((s,i) => (
          <div key={i} className="stat-card">
            <div style={{width:36,height:36,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',background:`${s.color}18`,color:s.color,border:`1px solid ${s.color}28`,marginBottom:12}}>{s.icon}</div>
            <div style={{fontSize:26,fontWeight:800,color:s.color,fontFamily:'Space Grotesk',letterSpacing:'-0.02em',marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:11,color:'var(--c-muted)',letterSpacing:'0.04em',textTransform:'uppercase',fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="pill-toggle" style={{marginBottom:24}}>
        {([{key:'schedules',label:'My Schedules'},{key:'bundles',label:'Quick Bundles'}] as {key:'schedules'|'bundles',label:string}[]).map(t => (
          <button key={t.key} className={activeTab===t.key?'active':''} onClick={()=>setActiveTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* Schedules */}
      {activeTab==='schedules' && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {schedules.map(s => (
            <div key={s.id} className="sched-card" style={{opacity:s.status==='paused'?0.72:1,transition:'opacity 0.2s'}}>

              {editingId!==s.id && (
                <div style={{padding:'20px 22px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:14}}>
                    <div style={{width:3,height:44,borderRadius:3,background:'#00E676',flexShrink:0}}/>
                    <div style={{width:42,height:42,borderRadius:11,flexShrink:0,background:'rgba(0,230,118,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#00E676',border:'1px solid rgba(0,230,118,0.2)'}}><IcCart/></div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                        <span style={{fontWeight:600,fontSize:14}}>{s.label}</span>
                        <span className={`badge badge-${s.status==='active'?'success':'warn'}`}>{s.status}</span>
                      </div>
                      <div style={{color:'var(--c-muted)',fontSize:12}}>{s.store} · {s.frequency} · ~₹{s.amount}/order</div>
                    </div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6,marginRight:16,maxWidth:240}}>
                      {s.items.slice(0,3).map((item,i)=><span key={i} style={{padding:'3px 10px',borderRadius:6,fontSize:11,background:'rgba(255,255,255,0.04)',border:'1px solid var(--c-border)',color:'var(--c-muted)'}}>{item}</span>)}
                      {s.items.length>3 && <span style={{padding:'3px 10px',borderRadius:6,fontSize:11,background:'rgba(0,230,118,0.08)',border:'1px solid rgba(0,230,118,0.2)',color:'#00E676'}}>+{s.items.length-3} more</span>}
                    </div>
                    <div style={{textAlign:'right',flexShrink:0,marginRight:12}}>
                      <div style={{fontSize:10,color:'var(--c-muted)',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:3}}>{s.status==='active'?'Next delivery':'Status'}</div>
                      <div style={{fontSize:13,fontWeight:600}}>{s.status==='active'?s.nextDelivery:<span style={{color:'var(--c-yellow)'}}>Paused</span>}</div>
                    </div>
                    <div style={{display:'flex',gap:6,flexShrink:0}}>
                      <button onClick={()=>toggleStatus(s.id)} className="btn btn-ghost" style={{padding:'7px 12px',fontSize:12,gap:6}}>{s.status==='active'?<><IcPause/>Pause</>:<><IcPlay/>Resume</>}</button>
                      <button onClick={()=>openEdit(s)} className="btn btn-ghost" style={{padding:'7px 12px',fontSize:12,gap:6}}><IcEdit/>Edit</button>
                      <button className="btn btn-green" style={{padding:'7px 12px',fontSize:12}} onClick={()=>alert(`Ordering from ${s.store}…`)}>Order Now</button>
                    </div>
                  </div>
                </div>
              )}

              {editingId===s.id && (
                <div>
                  <div style={{padding:'14px 22px',background:'rgba(0,230,118,0.06)',borderBottom:'1px solid rgba(0,230,118,0.12)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontWeight:700,fontSize:13,color:'#00E676',letterSpacing:'0.01em'}}>Editing — {s.label}</span>
                    <button onClick={()=>setEditingId(null)} style={{background:'none',border:'none',color:'var(--c-muted)',cursor:'pointer',display:'flex'}}><IcX/></button>
                  </div>
                  <div style={{padding:'22px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                    <div style={{display:'flex',flexDirection:'column',gap:14}}>
                      <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:7}}>Schedule Name</label><input value={editForm.label||''} onChange={e=>setEditForm(f=>({...f,label:e.target.value}))} placeholder="e.g. Monthly Kitchen Essentials"/></div>
                      <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:7}}>Frequency</label>
                        <select value={editForm.frequency||'Monthly'} onChange={e=>setEditForm(f=>({...f,frequency:e.target.value as 'Monthly'|'Weekly'}))}>
                          <option value="Weekly">Weekly</option><option value="Monthly">Monthly</option>
                        </select>
                      </div>
                      {editForm.frequency==='Weekly' && <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:7}}>Day of Week</label><select value={editForm.dayOfWeek||'Saturday'} onChange={e=>setEditForm(f=>({...f,dayOfWeek:e.target.value}))}>{DAYS_OF_WEEK.map(d=><option key={d} value={d}>{d}</option>)}</select></div>}
                      {editForm.frequency!=='Weekly' && <div><label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:7}}>Day of Month</label><select value={editForm.dayOfMonth||1} onChange={e=>setEditForm(f=>({...f,dayOfMonth:+e.target.value}))}>{Array.from({length:28},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</select></div>}
                    </div>
                    <div>
                      <div style={{fontSize:11,fontWeight:600,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10}}>Grocery Items</div>
                      <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:12,maxHeight:180,overflowY:'auto'}}>
                        {(editForm.items||[]).map((item,i)=>(
                          <div key={i} style={{display:'flex',alignItems:'center',gap:8,background:'rgba(0,230,118,0.04)',borderRadius:8,padding:'7px 12px',border:'1px solid rgba(0,230,118,0.12)'}}>
                            <span style={{flex:1,fontSize:13}}>{item}</span>
                            <button onClick={()=>removeItem(i)} style={{background:'none',border:'none',color:'var(--c-red)',cursor:'pointer',display:'flex'}}><IcX/></button>
                          </div>
                        ))}
                      </div>
                      <div style={{display:'flex',gap:8}}>
                        <input value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addItem()} placeholder="Add item (e.g. Milk 2L)" style={{flex:1}}/>
                        <button onClick={addItem} className="btn btn-green" style={{padding:'0 14px',fontSize:12,flexShrink:0}}>Add</button>
                      </div>
                    </div>
                  </div>
                  <div style={{padding:'14px 22px',borderTop:'1px solid var(--c-border)',display:'flex',gap:8,justifyContent:'flex-end'}}>
                    <button onClick={()=>setEditingId(null)} className="btn btn-ghost" style={{padding:'8px 16px',fontSize:12}}>Cancel</button>
                    <button onClick={saveEdit} className="btn btn-green" style={{padding:'8px 16px',fontSize:12}}>Save Changes</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="sched-card" style={{padding:'28px',textAlign:'center',borderStyle:'dashed',background:'transparent'}}>
            <div style={{width:40,height:40,borderRadius:10,background:'rgba(0,230,118,0.08)',display:'flex',alignItems:'center',justifyContent:'center',color:'#00E676',margin:'0 auto 12px'}}><IcPlus/></div>
            <div style={{fontWeight:600,fontSize:14,marginBottom:6}}>Add another grocery schedule</div>
            <div style={{color:'var(--c-muted)',fontSize:12,marginBottom:16}}>Weekly veggies, monthly staples, or custom bundles.</div>
            <Link href="/dashboard/groceries/new" className="btn btn-green" style={{fontSize:12}}><IcPlus/>Create Schedule</Link>
          </div>
        </div>
      )}

      {/* Bundles */}
      {activeTab==='bundles' && (
        <div>
          <p style={{fontSize:13,marginBottom:20}}>Start with a pre-built bundle and customise items later.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16}}>
            {popularBundles.map((b,i)=>(
              <div key={i} className="stat-card" style={{cursor:'pointer',transition:'transform 0.15s'}} onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-4px)')} onMouseLeave={e=>(e.currentTarget.style.transform='none')}>
                <div style={{width:42,height:42,borderRadius:11,background:'rgba(0,230,118,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#00E676',border:'1px solid rgba(0,230,118,0.2)',marginBottom:14}}>{b.icon}</div>
                <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{b.name}</div>
                <div style={{color:'var(--c-muted)',fontSize:12,marginBottom:14,lineHeight:1.4}}>{b.items}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <span style={{fontWeight:700,color:'#FC8019',fontSize:13}}>{b.price}</span>
                  <span className="badge badge-success">{b.freq}</span>
                </div>
                <button className="btn btn-green" style={{width:'100%',justifyContent:'center',fontSize:12}}>Use this bundle</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
