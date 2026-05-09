'use client';
import { useState } from 'react';
import Link from 'next/link';

type FilterTab = 'all' | 'meal' | 'grocery';

const mockOrders = [
  { id: 'o1', type: 'meal',    restaurant: 'Burger King',      items: 'Whopper + Fries',              amount: 349,  status: 'DELIVERED', date: 'Today',      time: '1:02 PM',  scheduleLabel: 'Work Lunch' },
  { id: 'o2', type: 'meal',    restaurant: 'Subway',            items: 'Veg Delight Sub',              amount: 219,  status: 'DELIVERED', date: 'Today',      time: '8:35 AM',  scheduleLabel: 'Daily Breakfast' },
  { id: 'o3', type: 'grocery', restaurant: 'Swiggy Instamart',  items: 'Rice 5kg, Dal 2kg, Oil 1L…',  amount: 1240, status: 'DELIVERED', date: 'Yesterday',  time: '10:20 AM', scheduleLabel: 'Monthly Kitchen Essentials' },
  { id: 'o4', type: 'meal',    restaurant: 'Burger King',      items: 'Whopper',                      amount: 249,  status: 'DELIVERED', date: 'Yesterday',  time: '1:00 PM',  scheduleLabel: 'Work Lunch' },
  { id: 'o5', type: 'grocery', restaurant: 'Swiggy Instamart',  items: 'Tomatoes 1kg, Milk 2L…',      amount: 380,  status: 'DELIVERED', date: 'Sat, May 3', time: '11:00 AM', scheduleLabel: 'Weekly Fresh Produce' },
  { id: 'o6', type: 'meal',    restaurant: 'Pizza Hut',         items: 'Margherita + Garlic Bread',   amount: 599,  status: 'DELIVERED', date: 'Mon, May 6', time: '7:30 PM',  scheduleLabel: 'Weekend Dinner' },
  { id: 'o7', type: 'meal',    restaurant: 'Burger King',      items: 'Whopper + Fries',              amount: 349,  status: 'SKIPPED',   date: 'Sun, May 5', time: '1:00 PM',  scheduleLabel: 'Work Lunch' },
  { id: 'o8', type: 'grocery', restaurant: 'Swiggy Instamart',  items: 'Spinach 500g, Curd 400g…',    amount: 280,  status: 'SKIPPED',   date: 'Sat, Apr 26',time: '11:00 AM', scheduleLabel: 'Weekly Fresh Produce' },
];

const statusColors: Record<string, string> = { DELIVERED: 'success', IN_TRANSIT: 'warn', PLACED: 'orange', FAILED: 'danger', SKIPPED: 'warn' };

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const filtered      = activeTab === 'all' ? mockOrders : mockOrders.filter(o => o.type === activeTab);
  const mealSpent     = mockOrders.filter(o => o.type === 'meal'    && o.status === 'DELIVERED').reduce((s, o) => s + o.amount, 0);
  const grocerySpent  = mockOrders.filter(o => o.type === 'grocery' && o.status === 'DELIVERED').reduce((s, o) => s + o.amount, 0);
  const totalSpent    = mealSpent + grocerySpent;

  return (
    <div style={{ padding: '36px 40px' }}>
      <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26, marginBottom: 6 }}>🕐 Order History</h1>
      <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginBottom: 28 }}>All your automated meals and grocery deliveries in one place.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Spend',      value: `₹${totalSpent.toLocaleString()}`,   icon: '💰', color: '#FF5F1F' },
          { label: 'Meal Spend',       value: `₹${mealSpent.toLocaleString()}`,    icon: '🍽️', color: '#FF7A45' },
          { label: 'Grocery Spend',    value: `₹${grocerySpent.toLocaleString()}`, icon: '🛒', color: '#22C55E' },
          { label: 'Skipped',          value: `${mockOrders.filter(o => o.status === 'SKIPPED').length}`, icon: '⏭️', color: '#F59E0B' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{ padding: '20px', borderRadius: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Spend bar */}
      <div className="glass" style={{ borderRadius: 14, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 12, color: 'var(--brand-muted)', flexShrink: 0 }}>Spend split:</span>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${(mealSpent / totalSpent) * 100}%`, background: 'linear-gradient(90deg,#FF5F1F,#FF7A45)', borderRadius: 3 }} />
          <div style={{ flex: 1, background: 'linear-gradient(90deg,#22C55E,#4ADE80)', borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 12, color: '#FF5F1F', flexShrink: 0 }}>🍽️ ₹{mealSpent}</span>
        <span style={{ fontSize: 12, color: '#22C55E', flexShrink: 0 }}>🛒 ₹{grocerySpent}</span>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'inline-flex', marginBottom: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--brand-border)', borderRadius: 12, overflow: 'hidden', padding: 3 }}>
        {([{ key: 'all', label: '🗂️ All' }, { key: 'meal', label: '🍽️ Meals' }, { key: 'grocery', label: '🛒 Groceries' }] as { key: FilterTab; label: string }[]).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '7px 18px', borderRadius: 9, border: 'none', fontWeight: 600, fontSize: 13,
            cursor: 'pointer', transition: 'all 0.15s',
            background: activeTab === tab.key ? 'rgba(255,95,31,0.2)' : 'transparent',
            color: activeTab === tab.key ? 'var(--brand-orange)' : 'var(--brand-muted)',
          }}>
            {tab.label} <span style={{ opacity: 0.6, fontSize: 11 }}>({(tab.key === 'all' ? mockOrders : mockOrders.filter(o => o.type === tab.key)).length})</span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(o => (
          <div key={o.id} className="glass" style={{ borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, background: o.type === 'meal' ? 'rgba(255,95,31,0.1)' : 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>
              {o.type === 'meal' ? '🛵' : '📦'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{o.restaurant}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 5, textTransform: 'uppercase', background: o.type === 'meal' ? 'rgba(255,95,31,0.12)' : 'rgba(34,197,94,0.12)', color: o.type === 'meal' ? '#FF5F1F' : '#22C55E' }}>{o.type}</span>
              </div>
              <div style={{ color: 'var(--brand-muted)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.items}</div>
              <div style={{ color: 'var(--brand-muted)', fontSize: 11, marginTop: 2 }}>📅 {o.scheduleLabel} • {o.date} at {o.time}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{o.status !== 'SKIPPED' ? `₹${o.amount.toLocaleString()}` : '—'}</div>
            <span className={`badge badge-${statusColors[o.status]}`} style={{ flexShrink: 0 }}>{o.status.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
