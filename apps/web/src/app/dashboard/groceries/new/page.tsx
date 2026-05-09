'use client';
import { useState } from 'react';
import Link from 'next/link';

const defaultItems = [
  { name: 'Basmati Rice 5kg', qty: 1, price: 380 },
  { name: 'Toor Dal 2kg',     qty: 1, price: 160 },
  { name: 'Mustard Oil 1L',   qty: 2, price: 180 },
  { name: 'Sugar 2kg',        qty: 1, price: 90  },
];

export default function NewGrocerySchedulePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    label: '',
    frequency: 'monthly' as 'weekly' | 'monthly',
    dayOfMonth: '1',
    dayOfWeek: 'Saturday',
    addressId: '',
    items: defaultItems,
    budgetLimit: '',
  });
  const [newItem, setNewItem] = useState('');

  const totalEstimate = form.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const addItem = () => {
    if (!newItem.trim()) return;
    setForm(f => ({ ...f, items: [...f.items, { name: newItem.trim(), qty: 1, price: 0 }] }));
    setNewItem('');
  };

  const removeItem = (idx: number) =>
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🛒</div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 26 }}>New Grocery Schedule</h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 8 }}>Step {step} of 3</p>
          <div style={{ marginTop: 14, height: 4, background: 'var(--brand-border)', borderRadius: 2 }}>
            <div style={{ height: 4, width: `${(step / 3) * 100}%`, background: 'var(--brand-orange)', borderRadius: 2, transition: 'width 0.35s' }} />
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 24, padding: '32px' }}>

          {/* ── Step 1: Label + Frequency ── */}
          {step === 1 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 24 }}>Name & Frequency</h2>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--brand-muted)', marginBottom: 8 }}>Schedule Name</label>
                <input
                  type="text" placeholder="e.g. Monthly Kitchen Staples, Weekly Dairy"
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
                    color: 'var(--brand-text)', fontSize: 15,
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--brand-muted)', marginBottom: 10 }}>Delivery Frequency</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {(['weekly', 'monthly'] as const).map(freq => (
                    <button key={freq} onClick={() => setForm(f => ({ ...f, frequency: freq }))} style={{
                      flex: 1, padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 15,
                      cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                      background: form.frequency === freq ? 'rgba(255,95,31,0.15)' : 'rgba(255,255,255,0.04)',
                      color: form.frequency === freq ? 'var(--brand-orange)' : 'var(--brand-muted)',
                      outline: form.frequency === freq ? '1px solid rgba(255,95,31,0.4)' : '1px solid var(--brand-border)',
                    }}>
                      {freq === 'weekly' ? '📅 Weekly' : '🗓️ Monthly'}
                      <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, color: 'inherit', opacity: 0.7 }}>
                        {freq === 'weekly' ? 'Every week on chosen day' : 'Once a month on chosen date'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {form.frequency === 'monthly' ? (
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: 'var(--brand-muted)', marginBottom: 8 }}>Day of Month</label>
                  <select
                    value={form.dayOfMonth}
                    onChange={e => setForm(f => ({ ...f, dayOfMonth: e.target.value }))}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
                      color: 'var(--brand-text)', fontSize: 15,
                    }}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'} of every month</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: 'var(--brand-muted)', marginBottom: 8 }}>Day of Week</label>
                  <select
                    value={form.dayOfWeek}
                    onChange={e => setForm(f => ({ ...f, dayOfWeek: e.target.value }))}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
                      color: 'var(--brand-text)', fontSize: 15,
                    }}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Build Grocery List ── */}
          {step === 2 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Build Your Grocery List</h2>
              <p style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 20 }}>
                These items will be ordered from Swiggy Instamart every {form.frequency === 'monthly' ? `month on the ${form.dayOfMonth}th` : `${form.dayOfWeek}`}.
              </p>

              {/* Item list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {form.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px',
                    border: '1px solid var(--brand-border)',
                  }}>
                    <span style={{ fontSize: 18 }}>🛍️</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.name}</span>
                    <button onClick={() => setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, qty: Math.max(1, it.qty - 1) } : it) }))}
                      style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.07)', border: 'none', color: 'var(--brand-text)', cursor: 'pointer', fontSize: 16 }}>−</button>
                    <span style={{ width: 24, textAlign: 'center', fontWeight: 600, fontSize: 14 }}>{item.qty}</span>
                    <button onClick={() => setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, qty: it.qty + 1 } : it) }))}
                      style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.07)', border: 'none', color: 'var(--brand-text)', cursor: 'pointer', fontSize: 16 }}>+</button>
                    <button onClick={() => removeItem(idx)}
                      style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 14 }}>✕</button>
                  </div>
                ))}
              </div>

              {/* Add item */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  type="text" placeholder="Add item (e.g. Olive Oil 500ml)"
                  value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addItem()}
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
                    color: 'var(--brand-text)', fontSize: 14,
                  }}
                />
                <button onClick={addItem} className="btn btn-primary" style={{ padding: '10px 16px' }}>Add</button>
              </div>

              {/* Estimate */}
              <div style={{
                background: 'rgba(255,95,31,0.06)', borderRadius: 12,
                padding: '12px 16px', fontSize: 14, display: 'flex', justifyContent: 'space-between',
                border: '1px solid rgba(255,95,31,0.15)',
              }}>
                <span style={{ color: 'var(--brand-muted)' }}>Estimated total</span>
                <strong style={{ color: 'var(--brand-orange)' }}>₹{totalEstimate}</strong>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === 3 && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Review & Confirm</h2>
              <div style={{ background: 'rgba(255,95,31,0.05)', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
                {[
                  { label: 'Name',      value: form.label || '—' },
                  { label: 'Frequency', value: form.frequency === 'monthly' ? `Monthly on ${form.dayOfMonth}th` : `Every ${form.dayOfWeek}` },
                  { label: 'Items',     value: `${form.items.length} items` },
                  { label: 'Est. cost', value: `~₹${totalEstimate} per delivery` },
                  { label: 'Store',     value: 'Swiggy Instamart' },
                  { label: 'Alert',     value: '1 day before delivery' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                    <span style={{ color: 'var(--brand-muted)' }}>{row.label}</span>
                    <span style={{ fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(34,197,94,0.06)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'var(--brand-muted)', marginBottom: 20, border: '1px solid rgba(34,197,94,0.15)' }}>
                ✅ You'll get a <strong style={{ color: 'var(--brand-text)' }}>WhatsApp/push notification 1 day before</strong> each delivery to confirm, skip, or change items.
              </div>

              <button
                onClick={() => alert('Grocery schedule saved! (Swiggy Instamart API integration coming soon)')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}
              >
                🚀 Activate Grocery Schedule
              </button>
            </div>
          )}

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {step > 1
              ? <button onClick={() => setStep(s => s - 1)} className="btn btn-ghost" style={{ flex: 1 }}>← Back</button>
              : <Link href="/dashboard/groceries" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</Link>
            }
            {step < 3 && (
              <button onClick={() => setStep(s => s + 1)} className="btn btn-primary" style={{ flex: 1 }}>Continue →</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
