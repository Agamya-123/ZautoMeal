'use client';
import { useState } from 'react';
import Link from 'next/link';

type OrderType = 'meal' | 'grocery';
type FilterTab = 'all' | 'meal' | 'grocery';

interface Order {
  id: string;
  type: OrderType;
  restaurant: string;
  items: string;
  amount: number;
  status: string;
  date: string;
  time: string;
  scheduleLabel: string;
}

const mockOrders: Order[] = [
  { id: 'o1', type: 'meal',    restaurant: 'Burger King',      items: 'Whopper + Fries',                    amount: 349,  status: 'DELIVERED',  date: 'Today',      time: '1:02 PM',  scheduleLabel: 'Work Lunch' },
  { id: 'o2', type: 'meal',    restaurant: 'Subway',            items: 'Veg Delight Sub',                    amount: 219,  status: 'DELIVERED',  date: 'Today',      time: '8:35 AM',  scheduleLabel: 'Daily Breakfast' },
  { id: 'o3', type: 'grocery', restaurant: 'Swiggy Instamart',  items: 'Rice 5kg, Dal 2kg, Mustard Oil 1L…', amount: 1240, status: 'DELIVERED',  date: 'Yesterday',  time: '10:20 AM', scheduleLabel: 'Monthly Kitchen Essentials' },
  { id: 'o4', type: 'meal',    restaurant: 'Burger King',       items: 'Whopper',                            amount: 249,  status: 'DELIVERED',  date: 'Yesterday',  time: '1:00 PM',  scheduleLabel: 'Work Lunch' },
  { id: 'o5', type: 'grocery', restaurant: 'Swiggy Instamart',  items: 'Tomatoes 1kg, Onions 1kg, Milk 2L…', amount: 380,  status: 'DELIVERED',  date: 'Sat, May 3', time: '11:00 AM', scheduleLabel: 'Weekly Fresh Produce' },
  { id: 'o6', type: 'meal',    restaurant: 'Pizza Hut',         items: 'Margherita + Garlic Bread',           amount: 599,  status: 'DELIVERED',  date: 'Mon, May 6', time: '7:30 PM',  scheduleLabel: 'Weekend Dinner' },
  { id: 'o7', type: 'meal',    restaurant: 'Burger King',       items: 'Whopper + Fries',                    amount: 349,  status: 'SKIPPED',    date: 'Sun, May 5', time: '1:00 PM',  scheduleLabel: 'Work Lunch' },
  { id: 'o8', type: 'grocery', restaurant: 'Swiggy Instamart',  items: 'Spinach 500g, Curd 400g, Butter…',  amount: 280,  status: 'SKIPPED',    date: 'Sat, Apr 26',time: '11:00 AM', scheduleLabel: 'Weekly Fresh Produce' },
];

const statusColors: Record<string, string> = {
  DELIVERED: 'success', IN_TRANSIT: 'warn', PLACED: 'orange', FAILED: 'danger', SKIPPED: 'warn',
};

const typeIcon: Record<OrderType, string> = { meal: '🍽️', grocery: '🛒' };
const typeBg: Record<OrderType, string>   = { meal: 'rgba(255,95,31,0.1)', grocery: 'rgba(34,197,94,0.1)' };
const typeColor: Record<OrderType, string> = { meal: '#FF5F1F', grocery: '#22C55E' };

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filtered = activeTab === 'all' ? mockOrders : mockOrders.filter(o => o.type === activeTab);

  const mealSpend     = mockOrders.filter(o => o.type === 'meal'    && o.status === 'DELIVERED').reduce((s, o) => s + o.amount, 0);
  const grocerySpend  = mockOrders.filter(o => o.type === 'grocery' && o.status === 'DELIVERED').reduce((s, o) => s + o.amount, 0);
  const totalSpend    = mealSpend + grocerySpend;
  const skipped       = mockOrders.filter(o => o.status === 'SKIPPED').length;

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
          { href: '/dashboard/history',   icon: '🕐', label: 'Order History', active: true },
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

          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, marginBottom: 6 }}>🕐 Order History</h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginBottom: 28 }}>All your automated meals and grocery deliveries in one place.</p>

          {/* ── Stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            {[
              { label: 'Total Spend',       value: `₹${totalSpend.toLocaleString()}`, color: '#FF5F1F' },
              { label: '🍽️ Meal Spend',     value: `₹${mealSpend.toLocaleString()}`,  color: '#FF5F1F' },
              { label: '🛒 Grocery Spend',  value: `₹${grocerySpend.toLocaleString()}`, color: '#22C55E' },
              { label: 'Skipped',           value: `${skipped}`,                       color: '#F59E0B' },
            ].map((s, i) => (
              <div key={i} className="glass" style={{ padding: '18px 20px', borderRadius: 16 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Spend bar ── */}
          <div className="glass" style={{ borderRadius: 16, padding: '18px 20px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, color: 'var(--brand-muted)' }}>
              <span>🍽️ Meals — ₹{mealSpend.toLocaleString()}</span>
              <span>🛒 Groceries — ₹{grocerySpend.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(mealSpend / totalSpend) * 100}%`,
                background: 'linear-gradient(90deg, #FF5F1F, #FF7A45)',
                borderRadius: 4, float: 'left',
              }} />
              <div style={{
                height: '100%',
                width: `${(grocerySpend / totalSpend) * 100}%`,
                background: 'linear-gradient(90deg, #22C55E, #4ADE80)',
                borderRadius: 4,
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginTop: 8, textAlign: 'center' }}>
              Total this period: <strong style={{ color: 'var(--brand-text)' }}>₹{totalSpend.toLocaleString()}</strong>
            </div>
          </div>

          {/* ── Filter tabs ── */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {([
              { key: 'all',     label: '🗂️ All Orders',   count: mockOrders.length },
              { key: 'meal',    label: '🍽️ Meals',        count: mockOrders.filter(o => o.type === 'meal').length },
              { key: 'grocery', label: '🛒 Groceries',    count: mockOrders.filter(o => o.type === 'grocery').length },
            ] as { key: FilterTab; label: string; count: number }[]).map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: '7px 16px', borderRadius: 10, fontWeight: 600, fontSize: 13,
                cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                background: activeTab === tab.key ? 'rgba(255,95,31,0.15)' : 'rgba(255,255,255,0.04)',
                color: activeTab === tab.key ? 'var(--brand-orange)' : 'var(--brand-muted)',
                outline: `1px solid ${activeTab === tab.key ? 'rgba(255,95,31,0.4)' : 'var(--brand-border)'}`,
              }}>
                {tab.label} <span style={{ opacity: 0.6, fontSize: 11 }}>({tab.count})</span>
              </button>
            ))}
          </div>

          {/* ── Order list ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(o => (
              <div key={o.id} className="glass" style={{
                borderRadius: 16, padding: '18px 22px',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                {/* Icon */}
                <div style={{
                  width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                  background: typeBg[o.type],
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>
                  {typeIcon[o.type]}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{o.restaurant}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6,
                      background: o.type === 'meal' ? 'rgba(255,95,31,0.12)' : 'rgba(34,197,94,0.12)',
                      color: typeColor[o.type], textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>{o.type}</span>
                  </div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.items}
                  </div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 11, marginTop: 3 }}>
                    📅 {o.scheduleLabel} • {o.date} at {o.time}
                  </div>
                </div>

                {/* Amount */}
                <div style={{ fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {o.status !== 'SKIPPED' ? `₹${o.amount.toLocaleString()}` : '—'}
                </div>

                {/* Status badge */}
                <span className={`badge badge-${statusColors[o.status] || 'orange'}`} style={{ flexShrink: 0 }}>
                  {o.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
