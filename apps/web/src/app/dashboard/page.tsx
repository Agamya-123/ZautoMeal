'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ── Mock data ──────────────────────────────────────────────────────────────
const mockSchedules = [
  { id: 's1', type: 'meal',    label: 'Work Lunch',              restaurant: 'Burger King',   time: '1:00 PM',  days: 'Mon–Fri',  status: 'active', nextOrder: 'Today 1:00 PM' },
  { id: 's2', type: 'meal',    label: 'Daily Breakfast',         restaurant: 'Subway',         time: '8:30 AM',  days: 'Daily',    status: 'active', nextOrder: 'Tomorrow 8:30 AM' },
  { id: 's3', type: 'grocery', label: 'Monthly Kitchen Essentials', restaurant: 'Swiggy Instamart', time: '1st of month', days: 'Monthly', status: 'active', nextOrder: '1st Jun' },
  { id: 's4', type: 'grocery', label: 'Weekly Fresh Produce',    restaurant: 'Swiggy Instamart', time: '11:00 AM', days: 'Saturday', status: 'active', nextOrder: 'Sat 11:00 AM' },
  { id: 's5', type: 'meal',    label: 'Weekend Dinner',          restaurant: 'Pizza Hut',      time: '7:30 PM',  days: 'Sat–Sun',  status: 'paused', nextOrder: 'Sat 7:30 PM' },
];

const mockOrders = [
  { id: 'o1', type: 'meal',    restaurant: 'Burger King',     items: 'Whopper + Fries',                     amount: 349,  status: 'DELIVERED',  time: '1:02 PM',  date: 'Today',     scheduleLabel: 'Work Lunch' },
  { id: 'o2', type: 'meal',    restaurant: 'Subway',           items: 'Veg Delight Sub',                     amount: 219,  status: 'DELIVERED',  time: '8:35 AM',  date: 'Today',     scheduleLabel: 'Daily Breakfast' },
  { id: 'o3', type: 'grocery', restaurant: 'Swiggy Instamart', items: 'Rice 5kg, Dal 2kg, Mustard Oil…',     amount: 1240, status: 'DELIVERED',  time: '10:20 AM', date: 'Yesterday', scheduleLabel: 'Monthly Kitchen Essentials' },
  { id: 'o4', type: 'meal',    restaurant: 'Burger King',     items: 'Whopper',                              amount: 249,  status: 'DELIVERED',  time: '1:00 PM',  date: 'Yesterday', scheduleLabel: 'Work Lunch' },
  { id: 'o5', type: 'grocery', restaurant: 'Swiggy Instamart', items: 'Tomatoes 1kg, Onions, Milk 2L…',      amount: 380,  status: 'DELIVERED',  time: '11:00 AM', date: 'Sat, May 3',scheduleLabel: 'Weekly Fresh Produce' },
];

const statusColors: Record<string, string> = {
  DELIVERED: 'success', IN_TRANSIT: 'warn', PLACED: 'orange', FAILED: 'danger', SKIPPED: 'warn',
};
type Filter = 'all' | 'meal' | 'grocery';

// ── Component ──────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [showNewScheduleModal, setShowNewScheduleModal] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  // Filtered data based on toggle
  const filteredOrders    = filter === 'all' ? mockOrders    : mockOrders.filter(o => o.type === filter);
  const filteredSchedules = filter === 'all' ? mockSchedules : mockSchedules.filter(s => s.type === filter);

  // Stats
  const deliveredOrders = (f: Filter) =>
    mockOrders.filter(o => o.status === 'DELIVERED' && (f === 'all' || o.type === f));

  const totalSpent   = deliveredOrders(filter).reduce((s, o) => s + o.amount, 0);
  const mealSpent    = deliveredOrders('meal').reduce((s, o) => s + o.amount, 0);
  const grocerySpent = deliveredOrders('grocery').reduce((s, o) => s + o.amount, 0);
  const activeCount  = filteredSchedules.filter(s => s.status === 'active').length;

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
          { href: '/dashboard',           icon: '🏠', label: 'Dashboard',     active: true },
          { href: '/dashboard/schedules', icon: '📅', label: 'Meal Schedules' },
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

        <div style={{ flex: 1 }} />
        <div style={{
          background: 'rgba(255,95,31,0.08)', border: '1px solid rgba(255,95,31,0.2)',
          borderRadius: 14, padding: '14px', fontSize: 12, color: 'var(--brand-muted)', lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 600, color: 'var(--brand-orange)', marginBottom: 4 }}>Free Plan</div>
          1 meal schedule • No groceries<br />
          <Link href="/dashboard/billing" style={{ color: 'var(--brand-orange)', textDecoration: 'none' }}>Upgrade to Starter →</Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: '36px 40px', overflow: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28 }}>Good afternoon, Agamya 👋</h1>
            <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 4 }}>Here's what's happening with your meals and groceries today.</p>
          </div>
          {/* New Schedule button → opens modal */}
          <button className="btn btn-primary" onClick={() => setShowNewScheduleModal(true)}>
            + New Schedule
          </button>
        </div>

        {/* ── Filter Toggle ── */}
        <div style={{
          display: 'inline-flex', gap: 0, marginBottom: 28,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--brand-border)',
          borderRadius: 12, overflow: 'hidden', padding: 3,
        }}>
          {([
            { key: 'all',     label: '🗂️ All' },
            { key: 'meal',    label: '🍽️ Meals' },
            { key: 'grocery', label: '🛒 Groceries' },
          ] as { key: Filter; label: string }[]).map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
              padding: '7px 18px', borderRadius: 9, border: 'none',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
              background: filter === tab.key ? 'rgba(255,95,31,0.2)' : 'transparent',
              color: filter === tab.key ? 'var(--brand-orange)' : 'var(--brand-muted)',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            {
              label: filter === 'all' ? 'Total Spent' : filter === 'meal' ? 'Meal Spent' : 'Grocery Spent',
              value: `₹${totalSpent.toLocaleString()}`,
              icon: '💰', color: '#FF5F1F',
            },
            filter === 'all' ? {
              label: 'Meal Spend', value: `₹${mealSpent.toLocaleString()}`, icon: '🍽️', color: '#FF7A45',
            } : {
              label: 'Active Schedules', value: `${activeCount}`, icon: '📅', color: '#8B5CF6',
            },
            filter === 'all' ? {
              label: 'Grocery Spend', value: `₹${grocerySpent.toLocaleString()}`, icon: '🛒', color: '#22C55E',
            } : {
              label: 'Orders This Month', value: `${filteredOrders.length}`, icon: '🛵', color: '#22C55E',
            },
            { label: 'Hours Saved', value: '9', icon: '⏳', color: '#8B5CF6' },
          ].map((stat, i) => (
            <div key={i} className="glass" style={{ padding: '22px', borderRadius: 18 }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Spend bar (all mode only) ── */}
        {filter === 'all' && (
          <div className="glass" style={{ borderRadius: 14, padding: '14px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--brand-muted)', flexShrink: 0 }}>Spend split:</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${(mealSpent / (mealSpent + grocerySpent)) * 100}%`, background: 'linear-gradient(90deg,#FF5F1F,#FF7A45)', borderRadius: 3 }} />
              <div style={{ flex: 1, background: 'linear-gradient(90deg,#22C55E,#4ADE80)', borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 12, color: '#FF5F1F', flexShrink: 0 }}>🍽️ ₹{mealSpent}</span>
            <span style={{ fontSize: 12, color: '#22C55E', flexShrink: 0 }}>🛒 ₹{grocerySpent}</span>
          </div>
        )}

        {/* ── Schedules ── */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontWeight: 700, fontSize: 17 }}>
              {filter === 'all' ? 'Your Schedules' : filter === 'meal' ? '🍽️ Meal Schedules' : '🛒 Grocery Schedules'}
            </h2>
            <Link href={filter === 'grocery' ? '/dashboard/groceries' : '/dashboard/schedules'} style={{ color: 'var(--brand-orange)', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredSchedules.map(s => (
              <div key={s.id} className="glass" style={{
                padding: '18px 22px', borderRadius: 16,
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                  background: s.type === 'meal' ? 'rgba(255,95,31,0.12)' : 'rgba(34,197,94,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>
                  {s.type === 'meal' ? '🍽️' : '🛒'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 5,
                      background: s.type === 'meal' ? 'rgba(255,95,31,0.12)' : 'rgba(34,197,94,0.12)',
                      color: s.type === 'meal' ? '#FF5F1F' : '#22C55E',
                      textTransform: 'uppercase',
                    }}>{s.type}</span>
                  </div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 12, marginTop: 2 }}>
                    {s.restaurant} • {s.time} • {s.days}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginBottom: 3 }}>Next</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.nextOrder}</div>
                </div>
                <span className={`badge badge-${s.status === 'active' ? 'success' : 'warn'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent Orders ── */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontWeight: 700, fontSize: 17 }}>Recent Orders</h2>
            <Link href="/dashboard/history" style={{ color: 'var(--brand-orange)', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredOrders.slice(0, 4).map(o => (
              <div key={o.id} className="glass" style={{
                padding: '14px 22px', borderRadius: 14,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: o.type === 'meal' ? 'rgba(255,95,31,0.1)' : 'rgba(34,197,94,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                }}>
                  {o.type === 'meal' ? '🛵' : '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{o.restaurant}</div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.items} • {o.date} {o.time}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>₹{o.amount.toLocaleString()}</div>
                <span className={`badge badge-${statusColors[o.status] || 'orange'}`} style={{ flexShrink: 0 }}>
                  {o.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ══ New Schedule Modal ══════════════════════════════════════════ */}
      {showNewScheduleModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }} onClick={() => setShowNewScheduleModal(false)}>
          <div className="glass" style={{
            borderRadius: 24, padding: '36px', maxWidth: 440, width: '100%',
            border: '1px solid var(--brand-border)',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, marginBottom: 8, textAlign: 'center' }}>
              What do you want to schedule?
            </h2>
            <p style={{ color: 'var(--brand-muted)', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>
              Choose a type to get started.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Meal option */}
              <button
                onClick={() => { setShowNewScheduleModal(false); router.push('/dashboard/schedules/new'); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 18, padding: '20px 22px',
                  borderRadius: 18, cursor: 'pointer', textAlign: 'left',
                  background: 'rgba(255,95,31,0.07)', border: '1px solid rgba(255,95,31,0.25)',
                  transition: 'all 0.2s', color: 'var(--brand-text)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,95,31,0.14)'; e.currentTarget.style.borderColor = 'rgba(255,95,31,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,95,31,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,95,31,0.25)'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, #FF5F1F, #FF7A45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                }}>🍽️</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Meal Schedule</div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 3, lineHeight: 1.4 }}>
                    Auto-order breakfast, lunch, dinner or snacks daily or on chosen days
                  </div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--brand-orange)', fontSize: 18 }}>→</span>
              </button>

              {/* Grocery option */}
              <button
                onClick={() => { setShowNewScheduleModal(false); router.push('/dashboard/groceries/new'); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 18, padding: '20px 22px',
                  borderRadius: 18, cursor: 'pointer', textAlign: 'left',
                  background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)',
                  transition: 'all 0.2s', color: 'var(--brand-text)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.14)'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.07)'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.25)'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, #22C55E, #4ADE80)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                }}>🛒</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Grocery Schedule</div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 3, lineHeight: 1.4 }}>
                    Auto-order weekly or monthly grocery lists via Swiggy Instamart
                  </div>
                </div>
                <span style={{ marginLeft: 'auto', color: '#22C55E', fontSize: 18 }}>→</span>
              </button>
            </div>

            <button
              onClick={() => setShowNewScheduleModal(false)}
              style={{
                marginTop: 20, width: '100%', padding: '10px', borderRadius: 12,
                background: 'transparent', border: '1px solid var(--brand-border)',
                color: 'var(--brand-muted)', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              }}
            >Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
