'use client';
import Link from 'next/link';

const mockSchedules = [
  { id: 's1', label: 'Work Lunch',      restaurant: 'Burger King',   time: '1:00 PM', days: 'Mon–Fri', status: 'active',  nextOrder: 'Today 1:00 PM' },
  { id: 's2', label: 'Daily Breakfast', restaurant: 'Subway',         time: '8:30 AM', days: 'Daily',   status: 'active',  nextOrder: 'Tomorrow 8:30 AM' },
  { id: 's3', label: 'Weekend Dinner',  restaurant: 'Pizza Hut',      time: '7:30 PM', days: 'Sat–Sun', status: 'paused',  nextOrder: 'Sat 7:30 PM' },
];

const mockOrders = [
  { id: 'o1', restaurant: 'Burger King', items: 'Whopper + Fries',    amount: 349, status: 'DELIVERED',  time: '1:02 PM' },
  { id: 'o2', restaurant: 'Subway',      items: 'Veg Delight Sub',    amount: 219, status: 'DELIVERED',  time: '8:35 AM' },
  { id: 'o3', restaurant: 'Burger King', items: 'Whopper',             amount: 249, status: 'IN_TRANSIT', time: '1:00 PM' },
];

const statusColors: Record<string, string> = {
  DELIVERED: 'success', IN_TRANSIT: 'warn', PLACED: 'orange', FAILED: 'danger',
};

export default function DashboardPage() {
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
          { href: '/dashboard/schedules', icon: '📅', label: 'Meal Schedules' },
          { href: '/dashboard/groceries', icon: '🛒', label: 'Groceries' },
          { href: '/dashboard/history',   icon: '🕐', label: 'Order History' },
          { href: '/dashboard/billing',   icon: '💳', label: 'Billing' },
          { href: '/dashboard/settings',  icon: '⚙️', label: 'Settings' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            borderRadius: 12, color: 'var(--brand-muted)', textDecoration: 'none',
            fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--brand-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--brand-muted)'; }}
          >
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{
          background: 'rgba(255,95,31,0.08)', border: '1px solid rgba(255,95,31,0.2)',
          borderRadius: 14, padding: '14px', fontSize: 12, color: 'var(--brand-muted)', lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 600, color: 'var(--brand-orange)', marginBottom: 4 }}>Free Plan</div>
          1/1 meal scheduled<br />
          <Link href="/dashboard/billing" style={{ color: 'var(--brand-orange)', textDecoration: 'none' }}>Upgrade to Pro →</Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: '36px 40px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28 }}>Good afternoon, Agamya 👋</h1>
            <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 4 }}>Here's what's happening with your meals today.</p>
          </div>
          <Link href="/dashboard/schedules/new" className="btn btn-primary">+ New Schedule</Link>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
          {[
            { label: 'Active Schedules', value: '2',    icon: '📅', color: '#FF5F1F' },
            { label: 'Orders This Month', value: '18',  icon: '🛵', color: '#22C55E' },
            { label: 'Total Spent',       value: '₹4,320', icon: '💰', color: '#F59E0B' },
            { label: 'Hours Saved',       value: '9',   icon: '⏳', color: '#8B5CF6' },
          ].map((stat, i) => (
            <div key={i} className="glass" style={{ padding: '22px', borderRadius: 18 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{stat.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-muted)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Schedules ── */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontWeight: 700, fontSize: 18 }}>Your Schedules</h2>
            <Link href="/dashboard/schedules" style={{ color: 'var(--brand-orange)', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockSchedules.map(s => (
              <div key={s.id} className="glass" style={{
                padding: '20px 24px', borderRadius: 16,
                display: 'flex', alignItems: 'center', gap: 20,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'linear-gradient(135deg, #FF5F1F22, #FF5F1F44)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                }}>🍽️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{s.label}</div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 2 }}>
                    {s.restaurant} • {s.time} • {s.days}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--brand-muted)', marginBottom: 4 }}>Next order</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.nextOrder}</div>
                </div>
                <span className={`badge badge-${s.status === 'active' ? 'success' : 'warn'}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent Orders ── */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontWeight: 700, fontSize: 18 }}>Recent Orders</h2>
            <Link href="/dashboard/history" style={{ color: 'var(--brand-orange)', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockOrders.map(o => (
              <div key={o.id} className="glass" style={{
                padding: '16px 24px', borderRadius: 14,
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{o.restaurant}</div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 12, marginTop: 2 }}>{o.items} • {o.time}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{o.amount > 0 ? `₹${o.amount}` : '—'}</div>
                <span className={`badge badge-${statusColors[o.status] || 'orange'}`}>
                  {o.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
