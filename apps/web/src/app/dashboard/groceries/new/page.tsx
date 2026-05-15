'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DAYS_OF_WEEK   = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAYS_OF_MONTH  = Array.from({ length: 28 }, (_, i) => i + 1);

const bundlePresets = [
  { id: 'b1', name: 'Kitchen Staples',  emoji: '🍚', items: ['Basmati Rice 5kg','Toor Dal 2kg','Mustard Oil 1L','Sugar 2kg','Salt 1kg','Turmeric 100g'],           est: 1240 },
  { id: 'b2', name: 'Daily Dairy',      emoji: '🥛', items: ['Milk 2L','Curd 400g','Butter 100g','Paneer 250g'],                                                   est: 380  },
  { id: 'b3', name: 'Fresh Veggies',    emoji: '🥦', items: ['Tomatoes 1kg','Onions 1kg','Spinach 500g','Potatoes 1kg','Green Chillies 100g'],                      est: 320  },
  { id: 'b4', name: 'Home Essentials',  emoji: '🧴', items: ['Soap x4','Shampoo 200ml','Detergent 1kg','Dishwash 500ml'],                                           est: 850  },
  { id: 'b5', name: 'Breakfast Items',  emoji: '🥞', items: ['Bread 2 packs','Eggs 12','Oats 1kg','Cornflakes 500g','Honey 500g'],                                  est: 620  },
  { id: 'b6', name: 'Custom Bundle',    emoji: '✏️', items: [],                                                                                                     est: 0    },
];

export default function NewGrocerySchedulePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    label:       '',
    bundleId:    '',
    items:       [] as string[],
    newItemText: '',
    frequency:   'Monthly' as 'Weekly' | 'Monthly',
    dayOfWeek:   'Saturday',
    dayOfMonth:  1,
    alertBefore: '1440',
  });

  const [warehouse, setWarehouse] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/warehouse')
      .then(res => res.json())
      .then(data => setWarehouse(data.catalog || []));
  }, []);

  const filteredWarehouse = warehouse.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !form.items.includes(p.name)
  ).slice(0, 8);

  const pickBundle = (b: typeof bundlePresets[0]) => {
    setForm(f => ({ ...f, bundleId: b.id, items: b.id === 'b6' ? [] : [...b.items] }));
  };

  const addItem = (name?: string) => {
    const text = name || form.newItemText.trim();
    if (!text) return;
    setForm(f => ({ ...f, items: [...f.items, text], newItemText: '' }));
  };

  const removeItem = (i: number) =>
    setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const canNext = step === 1
    ? !!form.label && !!form.bundleId && form.items.length > 0
    : step === 2
    ? true
    : true;

  const ordinalDay = (d: number) => `${d}${d===1?'st':d===2?'nd':d===3?'rd':'th'}`;

  const nextLabel = form.frequency === 'Weekly'
    ? `Every ${form.dayOfWeek}`
    : `${ordinalDay(form.dayOfMonth)} of every month`;

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link href="/dashboard/groceries" style={{ color: 'var(--brand-muted)', textDecoration: 'none', fontSize: 13 }}>← Grocery Schedules</Link>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>🛒 New Grocery Schedule</h1>
      </div>

      {/* Step indicator */}
      <div className="step-indicator" style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
        {['Items & Bundle', 'Frequency & Timing', 'Confirm'].map((label, i) => {
          const num = i + 1;
          const done   = step > num;
          const active = step === num;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'initial' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--brand-success)' : active ? '#22C55E' : 'rgba(255,255,255,0.08)',
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

      {/* ═══ STEP 1: Items & Bundle ══════════════════════════════════════ */}
      {step === 1 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20 }}>
          <div>
            {/* Schedule name */}
            <div className="glass" style={{ borderRadius: 18, padding: '24px', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Schedule Name</div>
              <input
                placeholder="e.g. Monthly Kitchen Essentials, Weekly Veggies…"
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              />
            </div>

            {/* Bundle picker */}
            <div className="glass" style={{ borderRadius: 18, padding: '24px', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Start with a Bundle</div>
              <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 16 }}>
                Choose a preset to get started, or pick "Custom Bundle".
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {bundlePresets.map(b => {
                  const selected = form.bundleId === b.id;
                  return (
                    <button key={b.id} onClick={() => pickBundle(b)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '12px',
                      borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      background: selected ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                      border: selected ? '1px solid rgba(34,197,94,0.5)' : '1px solid var(--brand-border)',
                      color: 'var(--brand-text)',
                    }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{b.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>{b.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--brand-muted)' }}>
                          {b.id === 'b6' ? 'Build' : `${b.items.length} items`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Item editor */}
            {form.bundleId && (
              <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                  {selectedBundle?.id === 'b6' ? 'Add Your Items' : `Items in ${selectedBundle?.name}`}
                </div>
                <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 16 }}>
                  Customise this list — add or remove anything.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                  {form.items.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: 10,
                      background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
                    }}>
                      <span style={{ fontSize: 12 }}>{item}</span>
                      <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: 'var(--brand-danger)', cursor: 'pointer', fontSize: 14, marginLeft: 8 }}>✕</button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    placeholder="Add item..."
                    value={form.newItemText}
                    onChange={e => setForm(f => ({ ...f, newItemText: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addItem()}
                    style={{ flex: 1 }}
                  />
                  <button onClick={() => addItem()} className="btn btn-primary" style={{ padding: '0 20px', fontSize: 13, flexShrink: 0 }}>+ Add</button>
                </div>
              </div>
            )}
          </div>

          {/* Warehouse Suggestions */}
          <div className="glass" style={{ borderRadius: 18, padding: '24px', height:'fit-content' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <span style={{ fontSize:18 }}>📦</span>
              <div style={{ fontWeight:700, fontSize:15 }}>Warehouse Catalog</div>
            </div>
            
            <input 
              placeholder="Search warehouse..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ fontSize:12, padding:'8px 12px', marginBottom:16 }}
            />

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {filteredWarehouse.map(p => (
                <button 
                  key={p.id}
                  onClick={() => addItem(p.name)}
                  style={{
                    display:'flex', alignItems:'center', gap:10, padding:10, borderRadius:10,
                    background:'rgba(255,255,255,0.03)', border:'1px solid var(--brand-border)',
                    textAlign:'left', cursor:'pointer'
                  }}
                >
                  <div style={{ width:8, height:8, borderRadius:'50%', background: p.in_stock ? '#00E676' : '#FF3B30' }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600 }}>{p.name}</div>
                    <div style={{ fontSize:10, color:'var(--brand-muted)' }}>₹{p.price} · {p.brand}</div>
                  </div>
                  <span style={{ fontSize:14, color:'#22C55E' }}>+</span>
                </button>
              ))}
              {filteredWarehouse.length === 0 && (
                <div style={{ fontSize:12, color:'var(--brand-muted)', textAlign:'center', padding:'20px 0' }}>No matching items found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 2: Frequency & Timing ══════════════════════════════════ */}
      {step === 2 && (
        <div className="stats-grid stats-grid-2" style={{ gap: 20 }}>
          {/* Frequency */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Delivery Frequency</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {(['Weekly', 'Monthly'] as const).map(freq => {
                  const active = form.frequency === freq;
                  return (
                    <button key={freq} onClick={() => setForm(f => ({ ...f, frequency: freq }))} style={{
                      flex: 1, padding: '20px 16px', borderRadius: 14, cursor: 'pointer',
                      textAlign: 'center', transition: 'all 0.15s', border: 'none',
                      background: active ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                      outline: active ? '1px solid rgba(34,197,94,0.5)' : '1px solid var(--brand-border)',
                      color: 'var(--brand-text)',
                    }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{freq === 'Weekly' ? '📆' : '🗓️'}</div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{freq}</div>
                      <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginTop: 4 }}>
                        {freq === 'Weekly' ? 'Every week on a chosen day' : 'Once a month on a chosen date'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day picker */}
            {form.frequency === 'Weekly' && (
              <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Day of the Week</div>
                <select value={form.dayOfWeek} onChange={e => setForm(f => ({ ...f, dayOfWeek: e.target.value }))}>
                  {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}
            {form.frequency === 'Monthly' && (
              <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Day of the Month</div>
                <select value={form.dayOfMonth} onChange={e => setForm(f => ({ ...f, dayOfMonth: +e.target.value }))}>
                  {DAYS_OF_MONTH.map(d => <option key={d} value={d}>{ordinalDay(d)}</option>)}
                </select>
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--brand-muted)' }}>Tip: pick 1st–5th to avoid month-end variation.</div>
              </div>
            )}
          </div>

          {/* Alert */}
          <div className="glass" style={{ borderRadius: 18, padding: '24px', alignSelf: 'start' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>🔔 Alert Before Delivery</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { value: '1440', label: '1 day before',    desc: 'Best for groceries — gives you time to adjust the list' },
                { value: '720',  label: '12 hours before', desc: 'Morning reminder for same-day delivery' },
                { value: '120',  label: '2 hours before',  desc: 'Quick heads-up before order is placed' },
              ].map(opt => {
                const sel = form.alertBefore === opt.value;
                return (
                  <button key={opt.value} onClick={() => setForm(f => ({ ...f, alertBefore: opt.value }))} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px',
                    borderRadius: 12, cursor: 'pointer', textAlign: 'left', border: 'none', transition: 'all 0.15s',
                    background: sel ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                    outline: sel ? '1px solid rgba(34,197,94,0.4)' : '1px solid var(--brand-border)',
                    color: 'var(--brand-text)',
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, marginTop: 2, border: '2px solid', borderColor: sel ? '#22C55E' : 'var(--brand-border)', background: sel ? '#22C55E' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {sel && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: Confirm ═════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="stats-grid stats-grid-2" style={{ gap: 20 }}>
          <div className="glass" style={{ borderRadius: 18, padding: '28px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📋 Schedule Summary</div>
            {[
              { label: 'Name',      value: form.label },
              { label: 'Bundle',    value: selectedBundle?.name || '—' },
              { label: 'Frequency', value: form.frequency },
              { label: 'Delivery',  value: nextLabel },
              { label: 'Alert',     value: form.alertBefore === '1440' ? '1 day before' : form.alertBefore === '720' ? '12 hrs before' : '2 hrs before' },
              { label: 'Total Items', value: `${form.items.length} items` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 14, paddingBottom: 14, borderBottom: '1px solid var(--brand-border)' }}>
                <span style={{ color: 'var(--brand-muted)' }}>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>

          <div>
            <div className="glass" style={{ borderRadius: 18, padding: '24px', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>🛒 Items in This Schedule</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {form.items.map((item, i) => (
                  <span key={i} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>{item}</span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(34,197,94,0.06)', borderRadius: 14, padding: '14px 16px', fontSize: 13, color: 'var(--brand-muted)', border: '1px solid rgba(34,197,94,0.15)', marginBottom: 20 }}>
              ✅ You'll get a notification <strong style={{ color: 'var(--brand-text)' }}>
                {form.alertBefore === '1440' ? '1 day' : form.alertBefore === '720' ? '12 hours' : '2 hours'} before
              </strong> each delivery to confirm, skip, or edit the list.
            </div>

            <button
              onClick={async () => {
                const estPrice = selectedBundle?.est || (form.items.length * 150); // rough estimate
                const days = form.frequency === 'Weekly' ? [form.dayOfWeek] : ['1st of Month']; // simplification
                
                try {
                  const res = await fetch('/api/schedules', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'GROCERY',
                      name: form.label,
                      restaurant: 'Swiggy Instamart', // Default for groceries
                      time: '11:00 AM', // Default grocery delivery time
                      days: days,
                      items: form.items,
                      totalAmount: estPrice
                    })
                  });
                  if (res.ok) {
                    router.push('/dashboard/groceries');
                  } else {
                    alert('Failed to save schedule');
                  }
                } catch (e) {
                  console.error(e);
                  alert('Error saving schedule');
                }
              }}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px', background: 'linear-gradient(135deg,#22C55E,#4ADE80)', boxShadow: '0 4px 24px rgba(34,197,94,0.35)' }}
            >
              🚀 Activate Grocery Schedule
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--brand-border)' }}>
        {step > 1
          ? <button onClick={() => setStep(s => s - 1)} className="btn btn-ghost">← Back</button>
          : <Link href="/dashboard/groceries" className="btn btn-ghost">Cancel</Link>
        }
        {step < 3 && (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext}
            className="btn btn-primary"
            style={{ opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'not-allowed', background: 'linear-gradient(135deg,#22C55E,#4ADE80)', boxShadow: '0 4px 16px rgba(34,197,94,0.3)' }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
