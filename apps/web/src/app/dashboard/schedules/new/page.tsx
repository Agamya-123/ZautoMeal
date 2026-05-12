'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function NewSchedulePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    label:        '',
    restaurantId: '',
    selectedItems: [] as string[],
    time:         '13:00',
    days:         [] as string[],
    timezone:     'Asia/Kolkata',
    alertBefore:  '60',
  });

  useEffect(() => {
    fetch('/api/catalog?category=meals')
      .then(res => res.json())
      .then(data => {
        setCatalogItems(data.items);
        setIsLoading(false);
      });
  }, []);

  // Derived "Restaurants" from Brands in Catalog
  const restaurants = Array.from(new Set(catalogItems.map(i => i.brand))).map(brand => ({
    id: brand,
    name: brand,
    emoji: brand === 'Dominos' ? '🍕' : brand === 'McD' ? '🍔' : '🍛',
    cuisine: 'Warehouse Partner'
  }));

  const menuItems = catalogItems.filter(i => i.brand === form.restaurantId);
  const chosenItems = menuItems.filter(m => form.selectedItems.includes(m.id));
  const totalPrice = chosenItems.reduce((s, i) => s + i.price, 0);

  const restaurant = restaurants.find(r => r.id === form.restaurantId);

  const toggleDay  = (d: string)  => setForm(f => ({ ...f, days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d] }));
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
    <div className="page-container" style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link href="/dashboard/schedules" style={{ color: 'var(--c-muted)', textDecoration: 'none', fontSize: 13 }}>← Meal Schedules</Link>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>📅 New Meal Schedule</h1>
      </div>

      {/* Step indicator */}
      <div className="step-indicator" style={{ display: 'flex', gap: 0, marginBottom: 36, alignItems: 'center' }}>
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
                  background: done ? '#00E676' : active ? '#FC8019' : 'rgba(255,255,255,0.08)',
                  color: done || active ? '#fff' : 'var(--c-muted)',
                }}>
                  {done ? '✓' : num}
                </div>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'var(--c-text)' : 'var(--c-muted)' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > num + 1 ? '#00E676' : 'var(--c-border)', margin: '0 16px' }} />}
            </div>
          );
        })}
      </div>

      {isLoading ? (
         <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--c-muted)' }}>Loading Catalog...</div>
      ) : (
        <>
          {/* STEP 1: Restaurant & Items */}
          {step === 1 && (
            <div>
              <div className="glass" style={{ borderRadius: 18, padding: '24px', marginBottom: 20, background:'rgba(255,255,255,0.02)', border:'1px solid var(--c-border)' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Schedule Name</div>
                <input
                  style={inputStyle} placeholder="e.g. Work Lunch, Daily Breakfast"
                  value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                />
              </div>

              <div className="glass" style={{ borderRadius: 18, padding: '24px', marginBottom: 20, background:'rgba(255,255,255,0.02)', border:'1px solid var(--c-border)' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Choose Restaurant (from Warehouse)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 12 }}>
                  {restaurants.map(r => {
                    const selected = form.restaurantId === r.id;
                    return (
                      <button key={r.id} onClick={() => setForm(f => ({ ...f, restaurantId: r.id, selectedItems: [] }))} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                        borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        background: selected ? 'rgba(252,128,25,0.15)' : 'rgba(255,255,255,0.04)',
                        border: selected ? '1px solid rgba(252,128,25,0.5)' : '1px solid var(--c-border)',
                        color: 'var(--c-text)',
                      }}>
                        <span style={{ fontSize: 26 }}>{r.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--c-muted)' }}>{r.cuisine}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {form.restaurantId && (
                <div className="glass" style={{ borderRadius: 18, padding: '24px', background:'rgba(255,255,255,0.02)', border:'1px solid var(--c-border)' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Choose Items from {restaurant?.name}</div>
                  <div style={{ color: 'var(--c-muted)', fontSize: 13, marginBottom: 16 }}>Select what gets ordered automatically.</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 12 }}>
                    {menuItems.map(item => {
                      const selected = form.selectedItems.includes(item.id);
                      return (
                        <button key={item.id} onClick={() => toggleItem(item.id)} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 16px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
                          background: selected ? 'rgba(252,128,25,0.12)' : 'rgba(255,255,255,0.04)',
                          border: selected ? '1px solid rgba(252,128,25,0.4)' : '1px solid var(--c-border)',
                          color: 'var(--c-text)',
                        }}>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: selected ? '#FC8019' : 'var(--c-muted)' }}>₹{item.price}</span>
                            <div style={{ width: 20, height: 20, borderRadius: 6, border: '2px solid', borderColor: selected ? '#FC8019' : 'var(--c-border)', background: selected ? '#FC8019' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>
                              {selected && '✓'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Days & Time */}
          {step === 2 && (
            <div className="stats-grid stats-grid-2" style={{ gap: 20 }}>
              <div className="glass" style={{ borderRadius: 18, padding: '24px', background:'rgba(255,255,255,0.02)', border:'1px solid var(--c-border)' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Repeat On</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {DAYS.map(d => {
                    const sel = form.days.includes(d);
                    return (
                      <button key={d} onClick={() => toggleDay(d)} style={{
                        padding: '10px 14px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                        cursor: 'pointer', transition: 'all 0.15s', border: 'none',
                        background: sel ? 'rgba(252,128,25,0.2)' : 'rgba(255,255,255,0.05)',
                        color: sel ? '#FC8019' : 'var(--c-muted)',
                        outline: sel ? '1px solid rgba(252,128,25,0.5)' : '1px solid var(--c-border)',
                      }}>{d}</button>
                    );
                  })}
                </div>
                {/* Restore Presets */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setForm(f => ({ ...f, days: ['Mon','Tue','Wed','Thu','Fri'] }))} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-border)', color: 'var(--c-muted)', cursor: 'pointer' }}>Weekdays</button>
                  <button onClick={() => setForm(f => ({ ...f, days: ['Sat','Sun'] }))} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-border)', color: 'var(--c-muted)', cursor: 'pointer' }}>Weekends</button>
                  <button onClick={() => setForm(f => ({ ...f, days: DAYS }))} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-border)', color: 'var(--c-muted)', cursor: 'pointer' }}>Daily</button>
                </div>
              </div>
              <div className="glass" style={{ borderRadius: 18, padding: '24px', background:'rgba(255,255,255,0.02)', border:'1px solid var(--c-border)' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Order Time</div>
                <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={inputStyle} />
              </div>
            </div>
          )}

          {/* STEP 3: Confirm */}
          {step === 3 && (
            <div className="stats-grid stats-grid-2" style={{ gap: 20 }}>
              <div className="glass" style={{ borderRadius: 18, padding: '28px', background:'rgba(255,255,255,0.02)', border:'1px solid var(--c-border)' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📋 Schedule Summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ color: 'var(--c-muted)' }}>Restaurant</span>
                  <strong>{restaurant?.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ color: 'var(--c-muted)' }}>Items</span>
                  <strong>{chosenItems.length} selected</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--c-border)' }}>
                  <span>Total</span>
                  <span style={{ color: '#FC8019' }}>₹{totalPrice}</span>
                </div>
              </div>
              <div>
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
        </>
      )}

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--c-border)' }}>
        {step > 1 && <button onClick={() => setStep(s => s - 1)} className="btn btn-ghost">← Back</button>}
        {step < 3 && (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext}
            className="btn btn-primary"
            style={{ opacity: canNext ? 1 : 0.4 }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
