'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

const IcUser    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IcCart    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const IcLock    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IcCheck   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

function Section({icon, title, children}: {icon:React.ReactNode; title:string; children:React.ReactNode}) {
  return (
    <div className="stat-card" style={{marginBottom:20}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,paddingBottom:14,borderBottom:'1px solid var(--c-border)'}}>
        <div style={{width:32,height:32,borderRadius:8,background:'rgba(252,128,25,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#FC8019',border:'1px solid rgba(252,128,25,0.2)'}}>{icon}</div>
        <h2 style={{fontSize:15}}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FieldRow({label, children}: {label:string; children:React.ReactNode}) {
  return (
    <div style={{marginBottom:16}}>
      <label style={{display:'block',fontSize:11,fontWeight:600,color:'var(--c-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:7}}>{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({label, desc, value, onChange, action}: {label:string; desc?:string; value:boolean; onChange:(v:boolean)=>void; action?:React.ReactNode}) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
      <div>
        <div style={{fontSize:13,fontWeight:500}}>{label}</div>
        {desc && <div style={{fontSize:12,color:'var(--c-muted)',marginTop:2}}>{desc}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {action}
        <div onClick={()=>onChange(!value)} style={{width:44,height:24,borderRadius:12,cursor:'pointer',transition:'background 0.2s',flexShrink:0,background:value?'#FC8019':'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',padding:'0 3px'}}>
          <div style={{width:18,height:18,borderRadius:9,background:'#fff',transition:'transform 0.2s',transform:value?'translateX(20px)':'translateX(0)',boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}}/>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();

  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [whatsapp,   setWhatsapp]   = useState(true);
  const [push,       setPush]       = useState(true);
  const [sms,        setSms]        = useState(true);
  const [alertTime,  setAlertTime]  = useState('60');
  const [autoConfirm,setAutoConfirm]= useState(true);
  const [pauseAll,   setPauseAll]   = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [isLoading,  setIsLoading]  = useState(true);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      
      // Fetch user settings from DB
      fetch('/api/user/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings) {
            setPhone(data.settings.phone || '');
            setIsPhoneVerified(data.settings.phoneVerified || false);
            setWhatsapp(data.settings.notifyWhatsapp);
            setPush(data.settings.notifyPush);
            setSms(data.settings.notifySms);
            setAlertTime(data.settings.alertLeadTime.toString());
            setAutoConfirm(data.settings.autoConfirm);
            setPauseAll(data.settings.pauseAll);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to load settings:', err);
          setIsLoading(false);
        });
    }
  }, [session]);

  const save = async () => { 
    try {
      await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          phoneVerified: isPhoneVerified,
          notifyWhatsapp: whatsapp,
          notifyPush: push,
          notifySms: sms,
          alertLeadTime: parseInt(alertTime),
          autoConfirm,
          pauseAll
        })
      });
      setSaved(true); 
      setTimeout(()=>setSaved(false),2500); 
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  const handleSendOtp = async () => {
    if (!phone) return alert('Please enter a phone number first');
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (res.ok) {
        setShowOtpModal(true);
      } else {
        alert(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      alert('Error sending OTP');
    }
    setIsSendingOtp(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert('Please enter the OTP');
    setIsVerifyingOtp(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsPhoneVerified(true);
        setShowOtpModal(false);
        setOtp('');
        
        // Auto-save the verified phone number to DB
        fetch('/api/user/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, phoneVerified: true })
        });
      } else {
        alert(data.error || 'Invalid OTP');
      }
    } catch (err) {
      alert('Error verifying OTP');
    }
    setIsVerifyingOtp(false);
  };

  const handleTestAlert = async (type: 'sms' | 'whatsapp') => {
    if (!phone) return alert('Please set your phone number first');
    try {
      const res = await fetch('/api/test-alert', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, type })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Success! ${type.toUpperCase()} sent.`);
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (err) {
      alert(`Error sending ${type}`);
    }
  };

  return (
    <div style={{padding:'32px 36px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
        <div>
          <h1 style={{marginBottom:4}}>Settings</h1>
          <p style={{fontSize:13}}>Manage your profile, notifications, and preferences.</p>
        </div>
        <button onClick={save} className="btn btn-primary" style={{minWidth:130}}>
          {saved ? <><IcCheck/>Saved!</> : 'Save Changes'}
        </button>
      </div>

      {/* Profile */}
      <Section icon={<IcUser/>} title="Profile">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <FieldRow label="Full Name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></FieldRow>
          <FieldRow label="Email Address"><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="your@email.com"/></FieldRow>
          <FieldRow label="Phone / WhatsApp">
            <div style={{ display: 'flex', gap: 10 }}>
              <input 
                value={phone} 
                onChange={e => { setPhone(e.target.value); setIsPhoneVerified(false); }} 
                type="tel" 
                placeholder="+91 00000 00000" 
                style={{ flex: 1, borderColor: (phone && !isPhoneVerified) ? 'rgba(252,128,25,0.4)' : undefined }}
              />
              {phone && isPhoneVerified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', background: 'rgba(0,230,118,0.1)', color: '#00E676', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1px solid rgba(0,230,118,0.2)' }}>
                  <IcCheck /> Verified
                </div>
              )}
              {phone && !isPhoneVerified && (
                <button className="btn btn-primary" style={{ padding: '0 16px', fontSize: 13 }} onClick={handleSendOtp} disabled={isSendingOtp}>
                  {isSendingOtp ? 'Sending...' : 'Verify'}
                </button>
              )}
            </div>
          </FieldRow>
          <FieldRow label="Timezone">
            <select>
              <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
              <option value="America/New_York">America/New_York (EST)</option>
            </select>
          </FieldRow>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={<IcBell/>} title="Notifications">
        <ToggleRow 
          label="WhatsApp Alerts" 
          desc="Order confirmations and reminders via WhatsApp" 
          value={whatsapp} 
          onChange={setWhatsapp}
          action={whatsapp && isPhoneVerified ? <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => handleTestAlert('whatsapp')}>Test</button> : null}
        />
        <ToggleRow label="Push Notifications"   desc="Browser and mobile push notifications"          value={push}        onChange={setPush}/>
        <ToggleRow 
          label="SMS Alerts" 
          desc="Text message fallback for critical alerts" 
          value={sms} 
          onChange={setSms}
          action={sms && isPhoneVerified ? <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => handleTestAlert('sms')}>Test</button> : null}
        />
        <div className="divider"/>
        <FieldRow label="Alert Lead Time">
          <select value={alertTime} onChange={e=>setAlertTime(e.target.value)}>
            <option value="30">30 minutes before order</option>
            <option value="60">1 hour before order</option>
            <option value="120">2 hours before order</option>
            <option value="1440">1 day before (recommended for groceries)</option>
          </select>
        </FieldRow>
      </Section>

      {/* Order Behaviour */}
      <Section icon={<IcCart/>} title="Order Behaviour">
        <ToggleRow label="Auto-confirm if no response" desc="If you don't reply to the alert, the order is placed automatically" value={autoConfirm} onChange={setAutoConfirm}/>
        <ToggleRow label="Pause all schedules"         desc="Temporarily stop all automated orders (e.g. on holiday)"           value={pauseAll}    onChange={v=>{setPauseAll(v); if(v)alert('All schedules will be paused.');}}/>
      </Section>

      {/* Account */}
      <Section icon={<IcLock/>} title="Account">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div><div style={{fontSize:13,fontWeight:500}}>Google Account</div><div style={{fontSize:12,color:'var(--c-muted)',marginTop:2}}>{session?.user?.email || 'Not connected'}</div></div>
          {session ? <span className="badge badge-success"><IcCheck/>Connected</span> : <span className="badge badge-warn">Not Connected</span>}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div><div style={{fontSize:13,fontWeight:500}}>Swiggy Account</div><div style={{fontSize:12,color:'var(--c-muted)',marginTop:2}}>Link to enable automated ordering</div></div>
          <button className="btn btn-ghost" style={{padding:'7px 14px',fontSize:12}}>Connect Swiggy</button>
        </div>
        <div className="divider"/>
        <div style={{display:'flex',gap:10,marginTop:16}}>
          <button className="btn btn-ghost" style={{fontSize:12,color:'var(--c-red)',borderColor:'rgba(239,68,68,0.25)'}} onClick={()=>signOut({ callbackUrl: '/login' })}>Sign Out</button>
          <button className="btn btn-ghost" style={{fontSize:12,color:'var(--c-red)',borderColor:'rgba(239,68,68,0.25)'}} onClick={()=>confirm('Delete your account permanently?')}>Delete Account</button>
        </div>
      </Section>

      {/* OTP Modal */}
      {showOtpModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="luxury-card" style={{ width: 360, padding: 32, textAlign: 'center', animation: 'fadeUp 0.2s ease-out' }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Verify WhatsApp Number</h3>
            <p style={{ fontSize: 13, color: 'var(--c-muted)', marginBottom: 24 }}>Enter the 6-digit code sent to {phone}</p>
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000" 
              value={otp}
              onChange={e => setOtp(e.target.value)}
              style={{ width: 140, fontSize: 24, letterSpacing: '0.2em', textAlign: 'center', marginBottom: 24 }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowOtpModal(false)} disabled={isVerifyingOtp}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleVerifyOtp} disabled={isVerifyingOtp}>
                {isVerifyingOtp ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
