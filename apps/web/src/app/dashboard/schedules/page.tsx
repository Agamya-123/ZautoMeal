'use client';
import { useState } from 'react';
import Link from 'next/link';

const mockSchedules = [
  {
    id: 's1', label: 'Work Lunch',      restaurant: 'Burger King',   restaurantId: 'r1',
    time: '1:00 PM', days: 'Mon–Fri',   status: 'active',  nextOrder: 'Today 1:00 PM',
    items: ['Whopper', 'Medium Fries'],  amount: 349,
  },
  {
    id: 's2', label: 'Daily Breakfast', restaurant: 'Subway',         restaurantId: 'r2',
    time: '8:30 AM', days: 'Daily',     status: 'active',  nextOrder: 'Tomorrow 8:30 AM',
    items: ['Veg Delight Sub'],          amount: 219,
  },
  {
    id: 's3', label: 'Weekend Dinner',  restaurant: 'Pizza Hut',      restaurantId: 'r3',
    time: '7:30 PM', days: 'Sat–Sun',   status: 'paused',  nextOrder: 'Sat 7:30 PM',
    items: ['Margherita', 'Garlic Bread'], amount: 599,
  },
];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState(mockSchedules);

  const toggleStatus = (id: string) => {
    setSchedules(prev =>
      prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s)
    );
  };

  const activeCount = schedules.filter(s => s.status === 'active').length;
  const monthlyEst  = schedules.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount * 20, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-dark)', display: 'flex' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240, flexShrink: 0, padding: '28px 16px',
        borderRight: '1px solid var(--brand-border)',
        background: 'var(--brand-surface)',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20, padding: '4px 12px', marginBottom: 24 }}>
          🍽️ <span className="gradient-text">Zautomeal</span>
        </div>
        {[
          { href: '/dashboard',           icon: '🏠', label: 'Dashboard' },
          { href: '/dashboard/schedules', icon: '📅', label: 'Meal Schedules', active: true },
          { href: '/dashboard/groceries', icon: '🛒', label: 'Groceries' },
          { href: '/dashboard/history',   icon: '🕐', label: 'Order History' },
          { href: '/dashboard/billing',   icon: '💳', label: 'Billing' },
          { href: '/dashboard/settings',  icon: '⚙️', label: 'Settings' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 500,
            background: (item as any).active ? 'rgba(255,95,31,0.12)' : 'transparent',
            color: (item as any).active ? 'var(--brand-orange)' : 'var(--brand-muted)',
            border: (item as any).active ? '1px solid rgba(255,95,31,0.2)' : '1px solid transparent',
          }}>
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: '36px 40px', overflow: 'auto' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28 }}>📅 Meal Schedules</h1>
              <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 6 }}>
                Automate your daily meals. Orders placed automatically on your chosen schedule.
              </p>
            </div>
            <Link href="/dashboard/schedules/new" className="btn btn-primary">+ New Schedule</Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Active Schedules',   value: `${activeCount}`,                    icon: '📅', color: '#FF5F1F' },
              { label: 'Total Schedules',    value: `${schedules.length}`,               icon: '🗂️', color: '#8B5CF6' },
              { label: 'Est. Monthly Spend', value: `~₹${monthlyEst.toLocaleString()}`, icon: '💰', color: '#22C55E' },
            ].map((s, i) => (
              <div key={i} className="glass" style={{ padding: '22px', borderRadius: 18 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--brand-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Schedules list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {schedules.map(s => (
              <div key={s.id} className="glass" style={{
                borderRadius: 20, padding: '24px',
                opacity: s.status === 'paused' ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                      background: s.status === 'active'
                        ? 'linear-gradient(135deg, rgba(255,95,31,0.2), rgba(255,95,31,0.05))'
                        : 'rgba(255,255,255,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                    }}>🍽️</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{s.label}</div>
                      <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 3 }}>
                        {s.restaurant} • {s.time} • {s.days}
                      </div>
                    </div>
                  </div>
                  <span className={`badge badge-${s.status === 'active' ? 'success' : 'warn'}`}>{s.status}</span>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {s.items.map((item, i) => (
                    <span key={i} style={{
                      padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)',
                      color: 'var(--brand-muted)',
                    }}>{item}</span>
                  ))}
                  <span style={{
                    padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                    background: 'rgba(255,95,31,0.08)', border: '1px solid rgba(255,95,31,0.2)',
                    color: 'var(--brand-orange)', cursor: 'pointer',
                  }}>+ Edit items</span>
                </div>

                {/* Footer row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: 14, borderTop: '1px solid var(--brand-border)',
                }}>
                  <div style={{ fontSize: 13, color: 'var(--brand-muted)' }}>
                    {s.status === 'active'
                      ? <>⏰ Next order: <strong style={{ color: 'var(--brand-text)' }}>{s.nextOrder}</strong></>
                      : <span style={{ color: 'var(--brand-warn)' }}>⏸ Schedule paused</span>
                    }
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => toggleStatus(s.id)}
                      className="btn btn-ghost"
                      style={{ padding: '7px 14px', fontSize: 12 }}
                    >
                      {s.status === 'active' ? '⏸ Pause' : '▶ Resume'}
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>✏️ Edit</button>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '7px 14px', fontSize: 12 }}
                      onClick={() => alert(`Ordering now from ${s.restaurant}…`)}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty CTA */}
            <div className="glass" style={{
              borderRadius: 20, padding: '32px', textAlign: 'center',
              border: '1px dashed rgba(255,255,255,0.1)', cursor: 'pointer',
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>➕</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Add a meal schedule</div>
              <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 16 }}>
                Set up breakfast, lunch, dinner, or a snack on any day and time.
              </div>
              <Link href="/dashboard/schedules/new" className="btn btn-primary" style={{ fontSize: 13 }}>
                Create Schedule →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
