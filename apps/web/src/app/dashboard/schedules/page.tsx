'use client';
import { useState } from 'react';
import Link from 'next/link';

const mockSchedules = [
  { id: 's1', label: 'Work Lunch',      restaurant: 'Burger King', time: '1:00 PM', days: 'Mon–Fri',  status: 'active', nextOrder: 'Today 1:00 PM',     items: ['Whopper', 'Medium Fries'], amount: 349 },
  { id: 's2', label: 'Daily Breakfast', restaurant: 'Subway',       time: '8:30 AM', days: 'Daily',    status: 'active', nextOrder: 'Tomorrow 8:30 AM',  items: ['Veg Delight Sub'],         amount: 219 },
  { id: 's3', label: 'Weekend Dinner',  restaurant: 'Pizza Hut',    time: '7:30 PM', days: 'Sat–Sun',  status: 'paused', nextOrder: 'Sat 7:30 PM',       items: ['Margherita', 'Garlic Bread'], amount: 599 },
];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState(mockSchedules);
  const toggleStatus = (id: string) => setSchedules(p => p.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s));
  const activeCount = schedules.filter(s => s.status === 'active').length;
  const monthlyEst  = schedules.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount * 20, 0);

  return (
    <div style={{ padding: '36px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>📅 Meal Schedules</h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 6 }}>Automate your daily meals. Orders placed automatically on your chosen schedule.</p>
        </div>
        <Link href="/dashboard/schedules/new" className="btn btn-primary">+ New Schedule</Link>
      </div>

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {schedules.map(s => (
          <div key={s.id} className="glass" style={{ borderRadius: 18, padding: '22px', opacity: s.status === 'paused' ? 0.7 : 1, transition: 'opacity 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: s.status === 'active' ? 'rgba(255,95,31,0.15)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🍽️</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{s.label}</div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 2 }}>{s.restaurant} • {s.time} • {s.days}</div>
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
                <button className="btn btn-ghost"    style={{ padding: '7px 14px', fontSize: 12 }}>✏️ Edit</button>
                <button className="btn btn-primary"  style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => alert(`Ordering now from ${s.restaurant}…`)}>Order Now</button>
              </div>
            </div>
          </div>
        ))}
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
