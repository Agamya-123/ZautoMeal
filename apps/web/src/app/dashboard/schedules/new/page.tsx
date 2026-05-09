'use client';
import { useState } from 'react';

export default function NewSchedulePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    label: '', restaurantId: '', items: [], addressId: '', time: '13:00',
    days: [] as string[], timezone: 'Asia/Kolkata',
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (d: string) => {
    setForm(f => ({
      ...f,
      days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d],
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 540 }}>
        {/* ── Header ── */}
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28 }}>Create a Meal Schedule</h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 8 }}>Step {step} of 3</p>
          {/* Progress bar */}
          <div style={{ marginTop: 16, height: 4, background: 'var(--brand-border)', borderRadius: 2 }}>
            <div style={{ height: 4, width: `${(step / 3) * 100}%`, background: 'var(--brand-orange)', borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 24, padding: '32px' }}>
          {/* ── Step 1: Label & Restaurant ── */}
          {step === 1 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 24 }}>What's this schedule for?</h2>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--brand-muted)', marginBottom: 8 }}>Schedule Name</label>
                <input
                  type="text" placeholder="e.g. Work Lunch, Daily Breakfast"
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
                    color: 'var(--brand-text)', fontSize: 15, outline: 'none',
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--brand-muted)', marginBottom: 8 }}>Restaurant (mock — Swiggy API coming soon)</label>
                <select
                  onChange={e => setForm(f => ({ ...f, restaurantId: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
                    color: 'var(--brand-text)', fontSize: 15,
                  }}
                >
                  <option value="">Select a restaurant</option>
                  <option value="r1">Burger King</option>
                  <option value="r2">Dominos</option>
                  <option value="r3">Subway</option>
                  <option value="r4">Pizza Hut</option>
                </select>
              </div>
            </div>
          )}

          {/* ── Step 2: Time & Days ── */}
          {step === 2 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 24 }}>When should we order?</h2>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--brand-muted)', marginBottom: 8 }}>Order Time</label>
                <input
                  type="time" value={form.time}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
                    color: 'var(--brand-text)', fontSize: 15,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--brand-muted)', marginBottom: 12 }}>Repeat on</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {days.map(d => (
                    <button key={d} onClick={() => toggleDay(d)} style={{
                      flex: 1, padding: '10px 4px', borderRadius: 10, fontWeight: 600, fontSize: 12,
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: form.days.includes(d) ? 'rgba(255,95,31,0.2)' : 'rgba(255,255,255,0.04)',
                      border: form.days.includes(d) ? '1px solid rgba(255,95,31,0.5)' : '1px solid var(--brand-border)',
                      color: form.days.includes(d) ? 'var(--brand-orange)' : 'var(--brand-muted)',
                    }}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === 3 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 24 }}>Review & Confirm</h2>
              <div style={{ background: 'rgba(255,95,31,0.06)', borderRadius: 16, padding: '20px', marginBottom: 24 }}>
                {[
                  { label: 'Name',       value: form.label || '—' },
                  { label: 'Time',       value: form.time },
                  { label: 'Days',       value: form.days.join(', ') || 'None selected' },
                  { label: 'Timezone',   value: form.timezone },
                  { label: 'Alert',      value: '1 hour before order' },
                  { label: 'Default',    value: 'Auto-confirm if no response' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                    <span style={{ color: 'var(--brand-muted)' }}>{row.label}</span>
                    <span style={{ fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => alert('Schedule saved! (API integration coming soon)')}
                className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}
              >
                🚀 Activate Schedule
              </button>
            </div>
          )}

          {/* ── Nav Buttons ── */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="btn btn-ghost" style={{ flex: 1 }}>← Back</button>
            )}
            {step < 3 && (
              <button onClick={() => setStep(s => s + 1)} className="btn btn-primary" style={{ flex: 1 }}>Continue →</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
