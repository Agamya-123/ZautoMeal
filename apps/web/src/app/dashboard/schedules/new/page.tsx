'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const restaurants = [
  { id: 'r1', name: 'Burger King',   emoji: '🍔', cuisine: 'Fast Food' },
  { id: 'r2', name: 'Subway',         emoji: '🥖', cuisine: 'Sandwiches' },
  { id: 'r3', name: 'Pizza Hut',      emoji: '🍕', cuisine: 'Pizza' },
  { id: 'r4', name: 'Dominos',        emoji: '🍕', cuisine: 'Pizza' },
  { id: 'r5', name: 'KFC',            emoji: '🍗', cuisine: 'Fast Food' },
  { id: 'r6', name: 'McDonald\'s',    emoji: '🍟', cuisine: 'Fast Food' },
  { id: 'r7', name: 'Biryani Blues',  emoji: '🍛', cuisine: 'Indian' },
  { id: 'r8', name: 'Haldiram\'s',    emoji: '🧆', cuisine: 'Indian Snacks' },
];

const mockMenuItems: Record<string, { id: string; name: string; price: number }[]> = {
  r1: [{ id: 'i1', name: 'Whopper',          price: 249 }, { id: 'i2', name: 'Medium Fries', price: 99 },  { id: 'i3', name: 'Pepsi 500ml', price: 69 }],
  r2: [{ id: 'i4', name: 'Veg Delight Sub',  price: 219 }, { id: 'i5', name: 'Chicken Teriyaki', price: 299 }],
  r3: [{ id: 'i6', name: 'Margherita (M)',   price: 299 }, { id: 'i7', name: 'Garlic Bread', price: 119 }],
  r4: [{ id: 'i8', name: 'Farmhouse (M)',    price: 349 }, { id: 'i9', name: 'Garlic Dip',  price: 29  }],
  r5: [{ id: 'ia', name: 'Chicken Zinger',   price: 249 }, { id: 'ib', name: 'Popcorn (M)', price: 179 }],
  r6: [{ id: 'ic', name: 'McAloo Tikki',     price: 69  }, { id: 'id', name: 'McVeggie',    price: 149 }],
  r7: [{ id: 'ie', name: 'Chicken Biryani',  price: 299 }, { id: 'if', name: 'Veg Biryani', price: 219 }],
  r8: [{ id: 'ig', name: 'Raj Kachori',      price: 99  }, { id: 'ih', name: 'Aloo Tikki',  price: 59  }],
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function NewSchedulePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    label:        '',
    restaurantId: '',
    selectedItems: [] as string[],
    time:         '13:00',
    days:         [] as string[],
    timezone:     'Asia/Kolkata',
    alertBefore:  '60',
  });

  const restaurant   = restaurants.find(r => r.id === form.restaurantId);
  const menuItems    = form.restaurantId ? (mockMenuItems[form.restaurantId] || []) : [];
  const chosenItems  = menuItems.filter(m => form.selectedItems.includes(m.id));
  const totalPrice   = chosenItems.reduce((s, i) => s + i.price, 0);

  const toggleDay  = (d: string)  => setForm(f => ({ ...f, days:          f.days.includes(d)          ? f.days.filter(x => x !== d)          : [...f.days, d] }));
  const toggleItem = (id: string) => setForm(f => ({ ...f, selectedItems: f.selectedItems.includes(id) ? f.selectedItems.filter(x => x !== id) : [...f.selectedItems, id] }));
  const canNext = step === 1 ? !!form.label && !!form.restaurantId && form.selectedItems.length > 0
                : step === 2 ? form.days.length > 0
                : true;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
    color: 'var(--brand-text)', fontSize: 14, outline: 'none',
  };

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link href="/dashboard/schedules" style={{ color: 'var(--brand-muted)', textDecoration: 'none', fontSize: 13 }}>← Meal Schedules</Link>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>📅 New Meal Schedule</h1>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 36, alignItems: 'center' }}>
        {['Restaurant & Items', 'Days & Time', 'Confirm'].map((label, i) => {
          const num = i + 1;
          const done   = step > num;
          const active = step === num;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'initial' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--brand-success)' : active ? 'var(--brand-orange)' : 'rgba(255,255,255,0.08)',
                  color: done || active ? '#fff' : 'var(--brand-muted)',
                }}>
                  {done ? '✓' : num}
                </div>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'var(--brand-text)' : 'var(--brand-muted)' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > num + 1 ? 'var(--brand-success)' : 'var(--brand-border)', margin: '0 16px' }} />}
            </div>
          );
        })}
      </div>

      {/* ═══ STEP 1: Restaurant & Items ═══════════════════════════════════ */}
      {step === 1 && (
        <div>
          {/* Schedule name */}
          <div className="glass" style={{ borderRadius: 18, padding: '24px', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Schedule Name</div>
            <input
              style={inputStyle} placeholder="e.g. Work Lunch, Daily Breakfast, Evening Snack"
              value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
            />
          </div>

          {/* Restaurant picker */}
          <div className="glass" style={{ borderRadius: 18, padding: '24px', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Choose Restaurant</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 12 }}>
              {restaurants.map(r => {
                const selected = form.restaurantId === r.id;
                return (
                  <button key={r.id} onClick={() => setForm(f => ({ ...f, restaurantId: r.id, selectedItems: [] }))} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                    borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    background: selected ? 'rgba(255,95,31,0.15)' : 'rgba(255,255,255,0.04)',
                    border: selected ? '1px solid rgba(255,95,31,0.5)' : '1px solid var(--brand-border)',
                    color: 'var(--brand-text)',
                  }}>
                    <span style={{ fontSize: 26 }}>{r.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--brand-muted)' }}>{r.cuisine}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu items */}
          {form.restaurantId && (
            <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Choose Items from {restaurant?.name}</div>
              <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 16 }}>Select what gets ordered automatically.</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 12 }}>
                {menuItems.map(item => {
                  const selected = form.selectedItems.includes(item.id);
                  return (
                    <button key={item.id} onClick={() => toggleItem(item.id)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
                      background: selected ? 'rgba(255,95,31,0.12)' : 'rgba(255,255,255,0.04)',
                      border: selected ? '1px solid rgba(255,95,31,0.4)' : '1px solid var(--brand-border)',
                      color: 'var(--brand-text)',
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: selected ? 'var(--brand-orange)' : 'var(--brand-muted)' }}>₹{item.price}</span>
                        <div style={{ width: 20, height: 20, borderRadius: 6, border: '2px solid', borderColor: selected ? 'var(--brand-orange)' : 'var(--brand-border)', background: selected ? 'var(--brand-orange)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>
                          {selected && '✓'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {chosenItems.length > 0 && (
                <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,95,31,0.08)', border: '1px solid rgba(255,95,31,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--brand-muted)' }}>{chosenItems.length} item{chosenItems.length > 1 ? 's' : ''} selected</span>
                  <strong style={{ color: 'var(--brand-orange)' }}>₹{totalPrice}/order</strong>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ STEP 2: Days & Time ═══════════════════════════════════════════ */}
      {step === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Days */}
          <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Repeat On</div>
            <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 18 }}>Which days should we order?</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {DAYS.map(d => {
                const sel = form.days.includes(d);
                return (
                  <button key={d} onClick={() => toggleDay(d)} style={{
                    padding: '10px 14px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                    cursor: 'pointer', transition: 'all 0.15s', border: 'none',
                    background: sel ? 'rgba(255,95,31,0.2)' : 'rgba(255,255,255,0.05)',
                    color: sel ? 'var(--brand-orange)' : 'var(--brand-muted)',
                    outline: sel ? '1px solid rgba(255,95,31,0.5)' : '1px solid var(--brand-border)',
                  }}>{d}</button>
                );
              })}
            </div>
            {/* Quick presets */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {[
                { label: 'Weekdays',  days: ['Mon','Tue','Wed','Thu','Fri'] },
                { label: 'Weekends',  days: ['Sat','Sun'] },
                { label: 'Daily',     days: DAYS },
              ].map(p => (
                <button key={p.label} onClick={() => setForm(f => ({ ...f, days: p.days }))} style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
                  color: 'var(--brand-muted)', cursor: 'pointer',
                }}>{p.label}</button>
              ))}
            </div>
          </div>

          {/* Time & Alert */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Order Time</div>
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={inputStyle} />
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--brand-muted)' }}>We'll place the order at this time.</div>
            </div>
            <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Alert Before Order</div>
              <select value={form.alertBefore} onChange={e => setForm(f => ({ ...f, alertBefore: e.target.value }))} style={{ marginBottom: 0 }}>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="120">2 hours before</option>
              </select>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--brand-muted)' }}>We'll ask if you want to confirm, skip, or reschedule.</div>
            </div>
            <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Timezone</div>
              <select value={form.timezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))} style={{ marginBottom: 0 }}>
                <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: Confirm ═══════════════════════════════════════════════ */}
      {step === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="glass" style={{ borderRadius: 18, padding: '28px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📋 Schedule Summary</div>
            {[
              { label: 'Name',         value: form.label },
              { label: 'Restaurant',   value: restaurant?.name || '—' },
              { label: 'Order Time',   value: form.time },
              { label: 'Days',         value: form.days.join(', ') || 'None' },
              { label: 'Timezone',     value: form.timezone },
              { label: 'Alert',        value: `${form.alertBefore} min before` },
              { label: 'Est. per order', value: `₹${totalPrice}` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 14, paddingBottom: 14, borderBottom: '1px solid var(--brand-border)' }}>
                <span style={{ color: 'var(--brand-muted)' }}>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
          <div>
            <div className="glass" style={{ borderRadius: 18, padding: '24px', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>🛒 Items</div>
              {chosenItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
                  <span>{item.name}</span>
                  <span style={{ color: 'var(--brand-orange)', fontWeight: 700 }}>₹{item.price}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--brand-border)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total per order</span>
                <span style={{ color: 'var(--brand-orange)' }}>₹{totalPrice}</span>
              </div>
            </div>
            <div style={{ background: 'rgba(34,197,94,0.06)', borderRadius: 14, padding: '14px 16px', fontSize: 13, color: 'var(--brand-muted)', border: '1px solid rgba(34,197,94,0.15)', marginBottom: 20 }}>
              ✅ You'll get a <strong style={{ color: 'var(--brand-text)' }}>notification {form.alertBefore} minutes before</strong> each order to confirm, skip, or reschedule.
            </div>
            <button
              onClick={async () => { 
                const res = await fetch('/api/schedules', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'MEAL',
                    name: form.label,
                    time: form.time,
                    days: form.days,
                    restaurant: restaurant?.name || 'Unknown',
                    items: chosenItems,
                    totalAmount: totalPrice
                  })
                });
                if (res.ok) {
                  router.push('/dashboard/schedules');
                  router.refresh();
                } else {
                  alert('Failed to save schedule.');
                }
              }}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px' }}
            >
              🚀 Activate Schedule
            </button>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--brand-border)' }}>
        {step > 1
          ? <button onClick={() => setStep(s => s - 1)} className="btn btn-ghost">← Back</button>
          : <Link href="/dashboard/schedules" className="btn btn-ghost">Cancel</Link>
        }
        {step < 3 && (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext}
            className="btn btn-primary"
            style={{ opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'not-allowed' }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
