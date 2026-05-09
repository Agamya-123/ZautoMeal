'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const mockSchedules = [
  { id: 's1', type: 'meal',    label: 'Work Lunch',               restaurant: 'Burger King',      time: '1:00 PM',      days: 'Mon–Fri',  status: 'active', nextOrder: 'Today 1:00 PM' },
  { id: 's2', type: 'meal',    label: 'Daily Breakfast',          restaurant: 'Subway',            time: '8:30 AM',      days: 'Daily',    status: 'active', nextOrder: 'Tomorrow 8:30 AM' },
  { id: 's3', type: 'grocery', label: 'Monthly Kitchen Essentials', restaurant: 'Swiggy Instamart', time: '1st of month', days: 'Monthly',  status: 'active', nextOrder: '1st Jun' },
  { id: 's4', type: 'grocery', label: 'Weekly Fresh Produce',     restaurant: 'Swiggy Instamart',  time: '11:00 AM',     days: 'Saturday', status: 'active', nextOrder: 'Sat 11:00 AM' },
  { id: 's5', type: 'meal',    label: 'Weekend Dinner',           restaurant: 'Pizza Hut',         time: '7:30 PM',      days: 'Sat–Sun',  status: 'paused', nextOrder: 'Sat 7:30 PM' },
];

const mockOrders = [
  { id: 'o1', type: 'meal',    restaurant: 'Burger King',      items: 'Whopper + Fries',              amount: 349,  status: 'DELIVERED', time: '1:02 PM',  date: 'Today',      scheduleLabel: 'Work Lunch' },
  { id: 'o2', type: 'meal',    restaurant: 'Subway',            items: 'Veg Delight Sub',              amount: 219,  status: 'DELIVERED', time: '8:35 AM',  date: 'Today',      scheduleLabel: 'Daily Breakfast' },
  { id: 'o3', type: 'grocery', restaurant: 'Swiggy Instamart',  items: 'Rice 5kg, Dal 2kg, Oil…',     amount: 1240, status: 'DELIVERED', time: '10:20 AM', date: 'Yesterday',  scheduleLabel: 'Monthly Kitchen Essentials' },
  { id: 'o4', type: 'meal',    restaurant: 'Burger King',      items: 'Whopper',                      amount: 249,  status: 'DELIVERED', time: '1:00 PM',  date: 'Yesterday',  scheduleLabel: 'Work Lunch' },
  { id: 'o5', type: 'grocery', restaurant: 'Swiggy Instamart',  items: 'Tomatoes 1kg, Milk 2L…',      amount: 380,  status: 'DELIVERED', time: '11:00 AM', date: 'Sat, May 3', scheduleLabel: 'Weekly Fresh Produce' },
];

const statusColors: Record<string, string> = { DELIVERED: 'success', IN_TRANSIT: 'warn', PLACED: 'orange', FAILED: 'danger', SKIPPED: 'warn' };
type Filter = 'all' | 'meal' | 'grocery';

export default function DashboardPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter]       = useState<Filter>('all');

  const filteredOrders    = filter === 'all' ? mockOrders    : mockOrders.filter(o => o.type === filter);
  const filteredSchedules = filter === 'all' ? mockSchedules : mockSchedules.filter(s => s.type === filter);

  const spent = (f: Filter) => mockOrders.filter(o => o.status === 'DELIVERED' && (f === 'all' || o.type === f)).reduce((s, o) => s + o.amount, 0);
  const mealSpent    = spent('meal');
  const grocerySpent = spent('grocery');
  const totalSpent   = spent(filter);

  return (
    <div style={{ padding: '36px 40px', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>Good afternoon, Agamya 👋</h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 4 }}>Here's what's happening with your meals and groceries today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Schedule</button>
      </div>

      {/* Filter toggle */}
      <div style={{ display: 'inline-flex', marginBottom: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--brand-border)', borderRadius: 12, overflow: 'hidden', padding: 3 }}>
        {(['all', 'meal', 'grocery'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 18px', borderRadius: 9, border: 'none', fontWeight: 600, fontSize: 13,
            cursor: 'pointer', transition: 'all 0.15s',
            background: filter === f ? 'rgba(255,95,31,0.2)' : 'transparent',
            color: filter === f ? 'var(--brand-orange)' : 'var(--brand-muted)',
          }}>
            {f === 'all' ? '🗂️ All' : f === 'meal' ? '🍽️ Meals' : '🛒 Groceries'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: filter === 'grocery' ? 'Grocery Spent' : filter === 'meal' ? 'Meal Spent' : 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: '💰', color: '#FF5F1F' },
          filter === 'all' ? { label: 'Meal Spend',     value: `₹${mealSpent.toLocaleString()}`,    icon: '🍽️', color: '#FF7A45' }
                           : { label: 'Active Schedules', value: `${filteredSchedules.filter(s=>s.status==='active').length}`, icon: '📅', color: '#8B5CF6' },
          filter === 'all' ? { label: 'Grocery Spend',  value: `₹${grocerySpent.toLocaleString()}`, icon: '🛒', color: '#22C55E' }
                           : { label: 'Orders',          value: `${filteredOrders.length}`,           icon: '🛵', color: '#22C55E' },
          { label: 'Hours Saved', value: '9', icon: '⏳', color: '#8B5CF6' },
        ].map((stat, i) => (
          <div key={i} className="glass" style={{ padding: '20px', borderRadius: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Spend bar */}
      {filter === 'all' && (
        <div className="glass" style={{ borderRadius: 14, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, color: 'var(--brand-muted)', flexShrink: 0 }}>Spend split:</span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${(mealSpent / (mealSpent + grocerySpent)) * 100}%`, background: 'linear-gradient(90deg,#FF5F1F,#FF7A45)', borderRadius: 3 }} />
            <div style={{ flex: 1, background: 'linear-gradient(90deg,#22C55E,#4ADE80)', borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 12, color: '#FF5F1F', flexShrink: 0 }}>🍽️ ₹{mealSpent}</span>
          <span style={{ fontSize: 12, color: '#22C55E', flexShrink: 0 }}>🛒 ₹{grocerySpent}</span>
        </div>
      )}

      {/* Schedules */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16 }}>
            {filter === 'grocery' ? '🛒 Grocery Schedules' : filter === 'meal' ? '🍽️ Meal Schedules' : 'Your Schedules'}
          </h2>
          <Link href={filter === 'grocery' ? '/dashboard/groceries' : '/dashboard/schedules'} style={{ color: 'var(--brand-orange)', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredSchedules.map(s => (
            <div key={s.id} className="glass" style={{ padding: '16px 20px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: s.type === 'meal' ? 'rgba(255,95,31,0.12)' : 'rgba(34,197,94,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{s.type === 'meal' ? '🍽️' : '🛒'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 5, textTransform: 'uppercase', background: s.type === 'meal' ? 'rgba(255,95,31,0.12)' : 'rgba(34,197,94,0.12)', color: s.type === 'meal' ? '#FF5F1F' : '#22C55E' }}>{s.type}</span>
                </div>
                <div style={{ color: 'var(--brand-muted)', fontSize: 12, marginTop: 2 }}>{s.restaurant} • {s.time} • {s.days}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginBottom: 2 }}>Next</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.nextOrder}</div>
              </div>
              <span className={`badge badge-${s.status === 'active' ? 'success' : 'warn'}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent orders */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16 }}>Recent Orders</h2>
          <Link href="/dashboard/history" style={{ color: 'var(--brand-orange)', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredOrders.slice(0, 4).map(o => (
            <div key={o.id} className="glass" style={{ padding: '14px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: o.type === 'meal' ? 'rgba(255,95,31,0.1)' : 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>
                {o.type === 'meal' ? '🛵' : '📦'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{o.restaurant}</div>
                <div style={{ color: 'var(--brand-muted)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.items} • {o.date}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, flexShrink: 0 }}>₹{o.amount.toLocaleString()}</div>
              <span className={`badge badge-${statusColors[o.status]}`} style={{ flexShrink: 0 }}>{o.status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── New Schedule Modal ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowModal(false)}>
          <div className="glass" style={{ borderRadius: 24, padding: '36px', maxWidth: 420, width: '100%', border: '1px solid var(--brand-border)' }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, marginBottom: 8, textAlign: 'center' }}>What do you want to schedule?</h2>
            <p style={{ color: 'var(--brand-muted)', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>Choose a type to get started.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '🍽️', label: 'Meal Schedule', desc: 'Auto-order breakfast, lunch, dinner or snacks on your chosen days', href: '/dashboard/schedules/new', bg: 'rgba(255,95,31,0.08)', border: 'rgba(255,95,31,0.3)', arrow: '#FF5F1F' },
                { icon: '🛒', label: 'Grocery Schedule', desc: 'Auto-order weekly or monthly grocery lists via Swiggy Instamart', href: '/dashboard/groceries/new', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.3)', arrow: '#22C55E' },
              ].map(opt => (
                <button key={opt.href} onClick={() => { setShowModal(false); router.push(opt.href); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderRadius: 16, cursor: 'pointer', textAlign: 'left', background: opt.bg, border: `1px solid ${opt.border}`, color: 'var(--brand-text)', width: '100%', transition: 'all 0.15s' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: opt.arrow + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{opt.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{opt.label}</div>
                    <div style={{ color: 'var(--brand-muted)', fontSize: 12, marginTop: 3, lineHeight: 1.4 }}>{opt.desc}</div>
                  </div>
                  <span style={{ color: opt.arrow, fontSize: 18, flexShrink: 0 }}>→</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowModal(false)} style={{ marginTop: 16, width: '100%', padding: '10px', borderRadius: 12, background: 'transparent', border: '1px solid var(--brand-border)', color: 'var(--brand-muted)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
