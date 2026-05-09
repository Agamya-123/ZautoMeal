'use client';
import { useState } from 'react';
import Link from 'next/link';

const initialGroceryLists = [
  {
    id: 'g1',
    label: 'Monthly Kitchen Essentials',
    frequency: 'Monthly' as const,
    dayOfMonth: 1,
    nextDelivery: '1st Jun 2026',
    items: ['Basmati Rice 5kg', 'Toor Dal 2kg', 'Mustard Oil 1L', 'Sugar 2kg', 'Salt 1kg'],
    amount: 1240,
    store: 'Swiggy Instamart',
    status: 'active' as const,
    alertBefore: '1440',
  },
  {
    id: 'g2',
    label: 'Weekly Fresh Produce',
    frequency: 'Weekly' as const,
    dayOfWeek: 'Saturday',
    nextDelivery: 'Sat, 10 May',
    items: ['Tomatoes 1kg', 'Onions 1kg', 'Spinach 500g', 'Milk 2L', 'Curd 400g'],
    amount: 380,
    store: 'Swiggy Instamart',
    status: 'active' as const,
    alertBefore: '1440',
  },
];

const popularBundles = [
  { icon: '🍚', name: 'Kitchen Staples', items: 'Rice, Dal, Oil, Spices',      price: '₹1,200–1,500', freq: 'Monthly' },
  { icon: '🥛', name: 'Daily Dairy',     items: 'Milk, Curd, Butter, Paneer',  price: '₹600–800',     freq: 'Weekly'  },
  { icon: '🥦', name: 'Fresh Veggies',   items: 'Seasonal vegetables, Herbs',  price: '₹300–500',     freq: 'Weekly'  },
  { icon: '🧴', name: 'Home Essentials', items: 'Soap, Shampoo, Detergent',    price: '₹800–1,200',   freq: 'Monthly' },
];

const DAYS_OF_WEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

type GrocerySchedule = typeof initialGroceryLists[0];

export default function GroceriesPage() {
  const [activeTab, setActiveTab]   = useState<'schedules' | 'bundles'>('schedules');
  const [schedules, setSchedules]   = useState(initialGroceryLists);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editForm, setEditForm]     = useState<Partial<GrocerySchedule>>({});
  const [newItem, setNewItem]       = useState('');

  const toggleStatus = (id: string) =>
    setSchedules(p => p.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s));

  const openEdit = (s: GrocerySchedule) => {
    setEditingId(s.id);
    setEditForm({ label: s.label, frequency: s.frequency, dayOfMonth: s.dayOfMonth, dayOfWeek: s.dayOfWeek, items: [...s.items], alertBefore: s.alertBefore });
  };

  const saveEdit = () => {
    setSchedules(p => p.map(s => s.id !== editingId ? s : { ...s, ...editForm }));
    setEditingId(null);
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setEditForm(f => ({ ...f, items: [...(f.items || []), newItem.trim()] }));
    setNewItem('');
  };

  const removeItem = (i: number) =>
    setEditForm(f => ({ ...f, items: (f.items || []).filter((_, idx) => idx !== i) }));

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>🛒 Grocery Schedules</h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 6 }}>Set up weekly or monthly grocery deliveries via Swiggy Instamart.</p>
        </div>
        <Link href="/dashboard/groceries/new" className="btn btn-primary">+ New Grocery Schedule</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Active Schedules',           value: `${schedules.filter(s => s.status === 'active').length}`, icon: '📦', color: '#22C55E' },
          { label: "This Month's Grocery Spend", value: '₹1,620',                                                  icon: '💰', color: '#FF5F1F' },
          { label: 'Items on Auto-order',         value: `${schedules.reduce((n,s) => n + s.items.length, 0)}`,   icon: '🛍️', color: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{ padding: '20px', borderRadius: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'inline-flex', marginBottom: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--brand-border)', borderRadius: 12, overflow: 'hidden', padding: 3 }}>
        {(['schedules', 'bundles'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '7px 18px', borderRadius: 9, border: 'none', fontWeight: 600, fontSize: 13,
            cursor: 'pointer', transition: 'all 0.15s',
            background: activeTab === tab ? 'rgba(255,95,31,0.2)' : 'transparent',
            color: activeTab === tab ? 'var(--brand-orange)' : 'var(--brand-muted)',
          }}>
            {tab === 'schedules' ? '📋 My Schedules' : '📦 Quick Bundles'}
          </button>
        ))}
      </div>

      {/* ── My Schedules ── */}
      {activeTab === 'schedules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {schedules.map(s => (
            <div key={s.id} className="glass" style={{ borderRadius: 18, overflow: 'hidden', opacity: s.status === 'paused' ? 0.75 : 1, transition: 'opacity 0.2s' }}>

              {/* Normal view */}
              {editingId !== s.id && (
                <div style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                        background: s.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                      }}>🛒</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{s.label}</div>
                        <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 2 }}>
                          {s.store} • {s.frequency} • ~₹{s.amount}/order
                        </div>
                      </div>
                    </div>
                    <span className={`badge badge-${s.status === 'active' ? 'success' : 'warn'}`}>{s.status}</span>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    {s.items.map((item, i) => (
                      <span key={i} style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)', color: 'var(--brand-muted)' }}>{item}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--brand-border)' }}>
                    <div style={{ fontSize: 13, color: 'var(--brand-muted)' }}>
                      {s.status === 'active'
                        ? <>📅 Next: <strong style={{ color: 'var(--brand-text)' }}>{s.nextDelivery}</strong></>
                        : <span style={{ color: 'var(--brand-warn)' }}>⏸ Paused</span>
                      }
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => toggleStatus(s.id)} className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>
                        {s.status === 'active' ? '⏸ Pause' : '▶ Resume'}
                      </button>
                      <button onClick={() => openEdit(s)} className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>✏️ Edit</button>
                      <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => alert(`Placing grocery order from ${s.store}…`)}>Order Now</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Inline Edit Form ── */}
              {editingId === s.id && (
                <div>
                  {/* Edit header */}
                  <div style={{ padding: '16px 22px', background: 'rgba(34,197,94,0.08)', borderBottom: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#22C55E' }}>✏️ Editing — {s.label}</span>
                    <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: 'var(--brand-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
                  </div>

                  <div style={{ padding: '22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Left col */}
                    <div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 12, color: 'var(--brand-muted)', marginBottom: 7 }}>Schedule Name</label>
                        <input value={editForm.label || ''} onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Monthly Kitchen Essentials" />
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 12, color: 'var(--brand-muted)', marginBottom: 7 }}>Frequency</label>
                        <select value={editForm.frequency || 'Monthly'} onChange={e => setEditForm(f => ({ ...f, frequency: e.target.value as 'Monthly' | 'Weekly' }))}>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                      </div>

                      {editForm.frequency === 'Weekly' && (
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: 'block', fontSize: 12, color: 'var(--brand-muted)', marginBottom: 7 }}>Day of Week</label>
                          <select value={editForm.dayOfWeek || 'Saturday'} onChange={e => setEditForm(f => ({ ...f, dayOfWeek: e.target.value }))}>
                            {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      )}

                      {(editForm.frequency === 'Monthly' || !editForm.frequency) && (
                        <div style={{ marginBottom: 16 }}>
                          <label style={{ display: 'block', fontSize: 12, color: 'var(--brand-muted)', marginBottom: 7 }}>Day of Month</label>
                          <select value={editForm.dayOfMonth || 1} onChange={e => setEditForm(f => ({ ...f, dayOfMonth: +e.target.value }))}>
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}{d===1?'st':d===2?'nd':d===3?'rd':'th'}</option>)}
                          </select>
                        </div>
                      )}

                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: 'var(--brand-muted)', marginBottom: 7 }}>Alert Before Delivery</label>
                        <select value={editForm.alertBefore || '1440'} onChange={e => setEditForm(f => ({ ...f, alertBefore: e.target.value }))}>
                          <option value="1440">1 day before</option>
                          <option value="720">12 hours before</option>
                          <option value="120">2 hours before</option>
                        </select>
                      </div>
                    </div>

                    {/* Right col — items */}
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--brand-muted)', marginBottom: 10 }}>Grocery Items</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14, maxHeight: 220, overflowY: 'auto' }}>
                        {(editForm.items || []).map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--brand-border)' }}>
                            <span style={{ flex: 1, fontSize: 13 }}>{item}</span>
                            <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: 'var(--brand-danger)', cursor: 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>✕</button>
                          </div>
                        ))}
                      </div>

                      {/* Add item */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          value={newItem}
                          onChange={e => setNewItem(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addItem()}
                          placeholder="Add item (e.g. Milk 2L)"
                          style={{ flex: 1 }}
                        />
                        <button onClick={addItem} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 13, flexShrink: 0 }}>+ Add</button>
                      </div>
                    </div>
                  </div>

                  {/* Save / Cancel */}
                  <div style={{ padding: '14px 22px', borderTop: '1px solid var(--brand-border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingId(null)} className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: 13 }}>Cancel</button>
                    <button onClick={saveEdit} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13, background: 'linear-gradient(135deg,#22C55E,#4ADE80)', boxShadow: '0 4px 16px rgba(34,197,94,0.3)' }}>💾 Save Changes</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add new CTA */}
          <div className="glass" style={{ borderRadius: 18, padding: '28px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>➕</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Add another grocery schedule</div>
            <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 16 }}>Weekly veggies, monthly staples, or custom bundles.</div>
            <Link href="/dashboard/groceries/new" className="btn btn-primary" style={{ fontSize: 13 }}>Create Schedule →</Link>
          </div>
        </div>
      )}

      {/* ── Quick Bundles ── */}
      {activeTab === 'bundles' && (
        <div>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginBottom: 20 }}>Start with a pre-built bundle and customise items later.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16 }}>
            {popularBundles.map((b, i) => (
              <div key={i} className="glass" style={{ borderRadius: 16, padding: '22px', transition: 'transform 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{b.name}</div>
                <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 12 }}>{b.items}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand-orange)', fontSize: 13 }}>{b.price}</span>
                  <span className="badge badge-success">{b.freq}</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13, background: 'linear-gradient(135deg,#22C55E,#4ADE80)', boxShadow: '0 4px 16px rgba(34,197,94,0.25)' }}>
                  Use this bundle →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
