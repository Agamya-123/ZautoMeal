'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [name,    setName]    = useState('Agamya');
  const [email,   setEmail]   = useState('agamya@example.com');
  const [phone,   setPhone]   = useState('+91 98765 43210');
  const [whatsapp, setWhatsapp] = useState(true);
  const [push,     setPush]     = useState(true);
  const [sms,      setSms]      = useState(false);
  const [alertTime, setAlertTime] = useState('60');
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div onClick={() => onChange(!value)} style={{
      width: 44, height: 24, borderRadius: 12, cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
      background: value ? 'var(--brand-orange)' : 'rgba(255,255,255,0.12)',
      display: 'flex', alignItems: 'center', padding: '0 3px',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: 9, background: '#fff',
        transition: 'transform 0.2s',
        transform: value ? 'translateX(20px)' : 'translateX(0)',
      }} />
    </div>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="glass" style={{ borderRadius: 18, padding: '24px', marginBottom: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--brand-border)' }}>{title}</div>
      {children}
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 12, color: 'var(--brand-muted)', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
    color: 'var(--brand-text)', fontSize: 14, outline: 'none',
  };

  const Row = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--brand-muted)', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ padding: '36px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>⚙️ Settings</h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 6 }}>Manage your profile, notifications, and preferences.</p>
        </div>
        <button onClick={save} className="btn btn-primary" style={{ fontSize: 13, minWidth: 120 }}>
          {saved ? '✅ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Profile */}
      <Section title="👤 Profile">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Full Name">
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Email Address">
            <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} type="email" />
          </Field>
          <Field label="Phone / WhatsApp">
            <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} type="tel" />
          </Field>
          <Field label="Timezone">
            <select style={{ marginBottom: 0 }}>
              <option>Asia/Kolkata (IST +5:30)</option>
              <option>Asia/Kolkata (IST +5:30)</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="🔔 Notifications">
        <Row label="WhatsApp Alerts" desc="Receive order confirmations on WhatsApp">
          <Toggle value={whatsapp} onChange={setWhatsapp} />
        </Row>
        <Row label="Push Notifications" desc="Browser / mobile push notifications">
          <Toggle value={push} onChange={setPush} />
        </Row>
        <Row label="SMS Alerts" desc="Text message fallback for critical alerts">
          <Toggle value={sms} onChange={setSms} />
        </Row>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--brand-border)' }}>
          <Field label="Alert Lead Time (minutes before order)">
            <select value={alertTime} onChange={e => setAlertTime(e.target.value)} style={{ marginBottom: 0 }}>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="120">2 hours before</option>
              <option value="1440">1 day before (for groceries)</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* Order Behaviour */}
      <Section title="🛒 Order Behaviour">
        <Row label="Auto-confirm if no response" desc="If you don't reply to the alert, the order will be placed automatically">
          <Toggle value={autoConfirm} onChange={setAutoConfirm} />
        </Row>
        <Row label="Pause all schedules" desc="Temporarily stop all automated orders">
          <Toggle value={false} onChange={() => alert('This will pause all schedules')} />
        </Row>
      </Section>

      {/* Account */}
      <Section title="🔐 Account">
        <Row label="Connected with Google" desc="agamya@example.com">
          <span className="badge badge-success">Connected</span>
        </Row>
        <Row label="Swiggy Account" desc="Link your Swiggy account to enable ordering">
          <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>Connect Swiggy →</button>
        </Row>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--brand-border)', display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ fontSize: 13, color: 'var(--brand-danger)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => alert('Logout')}>Sign Out</button>
          <button className="btn btn-ghost" style={{ fontSize: 13, color: 'var(--brand-danger)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => alert('Delete account?')}>Delete Account</button>
        </div>
      </Section>
    </div>
  );
}
