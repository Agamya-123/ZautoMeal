'use client';
import { useState, useEffect } from 'react';

const IcCard    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const IcFork    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><line x1="7" y1="11" x2="7" y2="22"/><path d="M21 15V2s-4 2-4 9v4a2 2 0 002 2h2z"/></svg>;
const IcCart    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const IcMoney   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const IcCheck   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;


// All plans removed - features are free

export default function BillingPage() {
  const [tab, setTab] = useState<'overview'|'invoices'>('overview');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/schedules')
      .then(r => r.json())
      .then(data => {
        setTimeout(() => {
          if (data.schedules) setSchedules(data.schedules);
          setIsLoading(false);
        }, 800);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const mealSchedules    = schedules.filter(s => (s.type === 'MEAL' || s.type === 'meal')    && s.isActive);
  const grocerySchedules = schedules.filter(s => (s.type === 'GROCERY' || s.type === 'grocery') && s.isActive);
  const pharmacySchedules = schedules.filter(s => (s.type === 'PHARMACY' || s.type === 'pharmacy') && s.isActive);
  
  const mealSpend    = mealSchedules.reduce((n,s) => n + s.totalAmount * 20, 0);
  const grocerySpend = grocerySchedules.reduce((n,s) => n + s.totalAmount * 20, 0);
  const pharmacySpend = pharmacySchedules.reduce((n,s) => n + s.totalAmount * 20, 0);
  const total = mealSpend + grocerySpend + pharmacySpend;

  return (
    <div className="page-container" style={{ padding:'32px 36px' }}>
      <h1 style={{marginBottom:4}}>Spending &amp; Usage</h1>
      <p style={{fontSize:13,marginBottom:24}}>Track your automated spending and monthly usage metrics.</p>

      {/* Tabs */}
      <div className="pill-toggle" style={{marginBottom:28}}>
        {([{k:'overview',l:'Overview'},{k:'invoices',l:'Invoices'}] as {k:'overview'|'invoices',l:string}[]).map(t=>(
          <button key={t.k} className={tab===t.k?'active':''} onClick={()=>setTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {/* Overview */}
      {tab==='overview' && (
        <div>

          {/* Usage cards */}
          <div className="stats-grid stats-grid-3" style={{marginBottom:20}}>
            {[
              {icon:<IcFork/>,label:'Meal Schedules',    used:mealSchedules.length,    spend:mealSpend,    color:'#FC8019'},
              {icon:<IcCart/>,label:'Grocery Schedules', used:grocerySchedules.length, spend:grocerySpend, color:'#00E676'},
              {icon:<IcCard/>,label:'Pharmacy Schedules',used:pharmacySchedules.length,spend:pharmacySpend,color:'#A78BFA'},
            ].map((s,i)=>(
              <div key={i} className="stat-card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:34,height:34,borderRadius:9,background:`${s.color}14`,display:'flex',alignItems:'center',justifyContent:'center',color:s.color,border:`1px solid ${s.color}22`}}>{s.icon}</div>
                    <span style={{fontWeight:600,fontSize:14}}>{s.label}</span>
                  </div>
                  <span className="badge badge-success">Active</span>
                </div>
                <div style={{height:4,background:'rgba(255,255,255,0.07)',borderRadius:2,marginBottom:12}}>
                  <div style={{height:4,borderRadius:2,width:'100%',background:`linear-gradient(90deg,${s.color},${s.color}aa)`}}/>
                </div>
                <div style={{fontSize:12,color:'var(--c-muted)'}}>Est. monthly: <strong style={{color:'var(--c-text)'}}>₹{isLoading?'…':s.spend.toLocaleString()}</strong></div>
              </div>
            ))}
          </div>

          {/* Spend breakdown */}
          <div className="stat-card">
            <div style={{fontWeight:600,fontSize:14,marginBottom:18}}>Monthly Spending Breakdown</div>
            <div className="stats-grid stats-grid-4">
              {[
                {label:'Meals /mo',        value:isLoading?'…':`₹${mealSpend.toLocaleString()}`,    color:'#FC8019'},
                {label:'Groceries /mo',    value:isLoading?'…':`₹${grocerySpend.toLocaleString()}`, color:'#00E676'},
                {label:'Pharmacy /mo',     value:isLoading?'…':`₹${pharmacySpend.toLocaleString()}`,color:'#A78BFA'},
                {label:'Total Est. /mo',   value:isLoading?'…':`₹${total.toLocaleString()}`,         color:'#FFF'},
              ].map((s,i)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.02)',borderRadius:10,padding:'14px',border:'1px solid var(--c-border)'}}>
                  <div style={{fontSize:11,color:'var(--c-muted)',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.04em',fontWeight:600}}>{s.label}</div>
                  <div style={{fontSize:22,fontWeight:800,color:s.color,fontFamily:'Space Grotesk',letterSpacing:'-0.02em'}}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Plans */}
      {tab==='plans' && (
        <div>
          <p style={{fontSize:13,marginBottom:24}}>All plans include both <strong style={{color:'var(--c-text)'}}>meal</strong> and <strong style={{color:'var(--c-text)'}}>grocery</strong> automation (limits vary).</p>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap:16 }}>
            {plans.map(plan=>(
              <div key={plan.id} style={{
                background: plan.highlight ? 'rgba(252,128,25,0.05)' : 'var(--c-card)',
                border:`1px solid ${plan.highlight?'rgba(252,128,25,0.35)':plan.current?'rgba(0,230,118,0.35)':'var(--c-border)'}`,
                borderRadius:16, padding:'24px 20px', position:'relative',
                boxShadow: plan.highlight ? '0 0 40px rgba(252,128,25,0.08)' : 'none',
              }}>
                {plan.highlight && <div className="badge badge-orange" style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)'}}>Best Value</div>}
                {plan.current  && <div className="badge badge-success" style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)'}}>Current Plan</div>}
                <div style={{fontFamily:'Space Grotesk',fontWeight:700,fontSize:17,marginBottom:6}}>{plan.name}</div>
                <div style={{marginBottom:18}}>
                  <span style={{fontSize:32,fontWeight:800,fontFamily:'Space Grotesk',letterSpacing:'-0.02em'}}>{plan.price===0?'Free':`₹${plan.price}`}</span>
                  {plan.price>0 && <span style={{color:'var(--c-muted)',fontSize:12}}>/mo</span>}
                </div>
                <div style={{background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'10px 12px',marginBottom:14,border:'1px solid var(--c-border)'}}>
                  <div style={{display:'flex',gap:8,fontSize:11,marginBottom:6,color:'var(--c-green)'}}><IcFork/><span>{plan.meals}</span></div>
                  <div style={{display:'flex',gap:8,fontSize:11,color:plan.groceries==='Not available'?'var(--c-red)':'var(--c-green)'}}><IcCart/><span>{plan.groceries}</span></div>
                </div>
                <ul style={{listStyle:'none',marginBottom:18}}>
                  {plan.features.map((f,i)=>(
                    <li key={i} style={{display:'flex',gap:8,marginBottom:7,fontSize:12,color:'var(--c-muted)',alignItems:'flex-start'}}>
                      <span style={{color:'var(--c-green)',flexShrink:0,marginTop:1}}><IcCheck/></span>{f}
                    </li>
                  ))}
                </ul>
                <button disabled={plan.current} style={{
                  width:'100%',padding:'10px',borderRadius:10,fontWeight:600,fontSize:12,cursor:plan.current?'default':'pointer',
                  background:plan.current?'rgba(255,255,255,0.04)':plan.highlight?'linear-gradient(135deg,#FC8019,#D35400)':'rgba(255,255,255,0.06)',
                  border:`1px solid ${plan.current?'var(--c-border)':'transparent'}`,
                  color:plan.current?'var(--c-muted)':'#fff',
                  boxShadow:plan.highlight&&!plan.current?'0 4px 20px rgba(252,128,25,0.3)':'none',
                }}>
                  {plan.current?'Current Plan':`Upgrade to ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
          <p style={{textAlign:'center',color:'var(--c-muted)',fontSize:12,marginTop:20}}>Payments via Razorpay · Cancel anytime · No hidden charges</p>
        </div>
      )}

      {tab==='invoices' && (
        <div className="stat-card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--c-border)', fontWeight:600, fontSize:14 }}>Recent Invoices</div>
          {schedules.length === 0 ? (
            <div style={{padding:'48px',textAlign:'center'}}>
              <div style={{width:48,height:48,borderRadius:12,background:'rgba(252,128,25,0.08)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FC8019',margin:'0 auto 16px',border:'1px solid rgba(252,128,25,0.18)'}}><IcCard/></div>
              <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>No invoices yet</div>
              <div style={{color:'var(--c-muted)',fontSize:13}}>Transactions from the showcase simulation will appear here.</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column' }}>
              {schedules.map((s,i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto auto', gap:20, padding:'16px 24px', alignItems:'center', borderBottom: i===schedules.length-1?'none':'1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>INV-{s.id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize:11, color:'var(--c-muted)', marginTop:2 }}>{new Date(s.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</div>
                  </div>
                  <div style={{ fontSize:13, color:'var(--c-muted)' }}>{s.name}</div>
                  <div style={{ fontWeight:700, fontSize:14 }}>₹{s.totalAmount.toLocaleString()}</div>
                  <span className="badge badge-success" style={{ padding:'4px 10px' }}>PAID</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
