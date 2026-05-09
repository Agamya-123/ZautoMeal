'use client';
import { useState } from 'react';
import Link from 'next/link';

const initialSchedules = [
  { id: 's1', label: 'Work Lunch',      restaurant: 'Burger King', time: '13:00', days: 'Mon–Fri', displayDays: ['Mon','Tue','Wed','Thu','Fri'], status: 'active',  nextOrder: 'Today 1:00 PM',     items: ['Whopper', 'Medium Fries'], amount: 349 },
  { id: 's2', label: 'Daily Breakfast', restaurant: 'Subway',       time: '08:30', days: 'Daily',   displayDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], status: 'active',  nextOrder: 'Tomorrow 8:30 AM',  items: ['Veg Delight Sub'],         amount: 219 },
  { id: 's3', label: 'Weekend Dinner',  restaurant: 'Pizza Hut',    time: '19:30', days: 'Sat–Sun', displayDays: ['Sat','Sun'],                  status: 'paused', nextOrder: 'Sat 7:30 PM',       items: ['Margherita', 'Garlic Bread'], amount: 599 },
];

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Schedule = typeof initialSchedules[0];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Schedule>>({});

  const activeCount = schedules.filter(s => s.status === 'active').length;
  const monthlyEst  = schedules.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount * 20, 0);

  const toggleStatus = (id: string) =>
    setSchedules(p => p.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s));

  const openEdit = (s: Schedule) => {
    setEditingId(s.id);
    setEditForm({ label: s.label, restaurant: s.restaurant, time: s.time, displayDays: [...s.displayDays] });
  };

  const saveEdit = () => {
    setSchedules(p => p.map(s => {
      if (s.id !== editingId) return s;
      const days = editForm.displayDays || s.displayDays;
      const dayLabel = days.length === 7 ? 'Daily'
        : days.join('') === 'MonTueWedThuFri' ? 'Mon–Fri'
        : days.join('') === 'SatSun' ? 'Sat–Sun'
        : days.join(', ');
      return { ...s, ...editForm, displayDays: days, days: dayLabel };
    }));
    setEditingId(null);
  };

  const toggleEditDay = (d: string) => {
    setEditForm(f => {
      const cur = f.displayDays || [];
      return { ...f, displayDays: cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d] };
    });
  };

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>📅 Meal Schedules</h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 6 }}>Automate your daily meals. Orders placed automatically on your chosen schedule.</p>
        </div>
        <Link href="/dashboard/schedules/new" className="btn btn-primary">+ New Schedule</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Active Schedules',   value: `${activeCount}`,                    icon: '📅', color: '#FF5F1F' },
          { label: 'Total Schedules',    value: `${schedules.length}`,               icon: '🗂️', color: '#8B5CF6' },
          { label: 'Est. Monthly Spend', value: `~₹${monthlyEst.toLocaleString()}`, icon: '💰', color: '#22C55E' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{ padding: '20px', borderRadius: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Schedules list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {schedules.map(s => (
          <div key={s.id} className="glass" style={{ borderRadius: 18, overflow: 'hidden', opacity: s.status === 'paused' ? 0.75 : 1, transition: 'opacity 0.2s' }}>

            {/* ── Normal view ── */}
            {editingId !== s.id && (
              <div style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: s.status === 'active' ? 'rgba(255,95,31,0.15)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🍽️</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{s.label}</div>
                      <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 2 }}>{s.restaurant} • {s.time.replace(':', ':')} • {s.days}</div>
                    </div>
                  </div>
                  <span className={`badge badge-${s.status === 'active' ? 'success' : 'warn'}`}>{s.status}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                  {s.items.map((item, i) => (
                    <span key={i} style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)', color: 'var(--brand-muted)' }}>{item}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--brand-border)' }}>
                  <div style={{ fontSize: 13, color: 'var(--brand-muted)' }}>
                    {s.status === 'active' ? <>⏰ Next: <strong style={{ color: 'var(--brand-text)' }}>{s.nextOrder}</strong></> : <span style={{ color: 'var(--brand-warn)' }}>⏸ Paused</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => toggleStatus(s.id)} className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>{s.status === 'active' ? '⏸ Pause' : '▶ Resume'}</button>
                    <button onClick={() => openEdit(s)} className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>✏️ Edit</button>
                    <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => alert(`Placing order from ${s.restaurant}…`)}>Order Now</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Inline Edit Form ── */}
            {editingId === s.id && (
              <div style={{ padding: '0' }}>
                {/* Edit header */}
                <div style={{ padding: '16px 22px', background: 'rgba(255,95,31,0.08)', borderBottom: '1px solid rgba(255,95,31,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--brand-orange)' }}>✏️ Editing — {s.label}</span>
                  <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: 'var(--brand-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
                </div>

                <div style={{ padding: '22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {/* Left col */}
                  <div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--brand-muted)', marginBottom: 7 }}>Schedule Name</label>
                      <input
                        value={editForm.label || ''}
                        onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))}
                        placeholder="e.g. Work Lunch"
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--brand-muted)', marginBottom: 7 }}>Restaurant</label>
                      <input
                        value={editForm.restaurant || ''}
                        onChange={e => setEditForm(f => ({ ...f, restaurant: e.target.value }))}
                        placeholder="e.g. Burger King"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--brand-muted)', marginBottom: 7 }}>Order Time</label>
                      <input
                        type="time"
                        value={editForm.time || ''}
                        onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Right col — days */}
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--brand-muted)', marginBottom: 10 }}>Repeat On</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                      {ALL_DAYS.map(d => {
                        const sel = (editForm.displayDays || []).includes(d);
                        return (
                          <button key={d} onClick={() => toggleEditDay(d)} style={{
                            padding: '8px 12px', borderRadius: 8, fontWeight: 700, fontSize: 12,
                            cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                            background: sel ? 'rgba(255,95,31,0.2)' : 'rgba(255,255,255,0.05)',
                            color: sel ? 'var(--brand-orange)' : 'var(--brand-muted)',
                            outline: sel ? '1px solid rgba(255,95,31,0.5)' : '1px solid var(--brand-border)',
                          }}>{d}</button>
                        );
                      })}
                    </div>
                    {/* Presets */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { label: 'Weekdays', days: ['Mon','Tue','Wed','Thu','Fri'] },
                        { label: 'Weekends', days: ['Sat','Sun'] },
                        { label: 'Daily',    days: ALL_DAYS },
                      ].map(p => (
                        <button key={p.label} onClick={() => setEditForm(f => ({ ...f, displayDays: p.days }))} style={{
                          padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
                          color: 'var(--brand-muted)', cursor: 'pointer',
                        }}>{p.label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save / Cancel */}
                <div style={{ padding: '14px 22px', borderTop: '1px solid var(--brand-border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditingId(null)} className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: 13 }}>Cancel</button>
                  <button onClick={saveEdit} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>💾 Save Changes</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add new CTA */}
        <div className="glass" style={{ borderRadius: 18, padding: '28px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>➕</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Add a meal schedule</div>
          <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 16 }}>Breakfast, lunch, dinner, or snacks — any day, any time.</div>
          <Link href="/dashboard/schedules/new" className="btn btn-primary" style={{ fontSize: 13 }}>Create Schedule →</Link>
        </div>
      </div>
    </div>
  );
}
