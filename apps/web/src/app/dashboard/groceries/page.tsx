'use client';
import { useState } from 'react';
import Link from 'next/link';

const mockGroceryLists = [
  {
    id: 'g1', label: 'Monthly Kitchen Essentials',
    frequency: 'Monthly', nextDelivery: '1st Jun 2026',
    items: ['Basmati Rice 5kg', 'Toor Dal 2kg', 'Mustard Oil 1L', 'Sugar 2kg', 'Salt 1kg'],
    amount: 1240, store: 'Swiggy Instamart', status: 'active',
  },
  {
    id: 'g2', label: 'Weekly Fresh Produce',
    frequency: 'Weekly', nextDelivery: 'Sat, 10 May',
    items: ['Tomatoes 1kg', 'Onions 1kg', 'Spinach 500g', 'Milk 2L', 'Curd 400g'],
    amount: 380, store: 'Swiggy Instamart', status: 'active',
  },
];

const popularBundles = [
  { icon: '🍚', name: 'Kitchen Staples', items: 'Rice, Dal, Oil, Spices', price: '₹1,200–1,500', freq: 'Monthly' },
  { icon: '🥛', name: 'Daily Dairy',     items: 'Milk, Curd, Butter, Paneer', price: '₹600–800',   freq: 'Weekly' },
  { icon: '🥦', name: 'Fresh Veggies',   items: 'Seasonal vegetables, Herbs', price: '₹300–500',   freq: 'Weekly' },
  { icon: '🧴', name: 'Home Essentials', items: 'Soap, Shampoo, Detergent', price: '₹800–1,200',  freq: 'Monthly' },
];

export default function GroceriesPage() {
  const [activeTab, setActiveTab] = useState<'schedules' | 'bundles'>('schedules');

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
          { href: '/dashboard/groceries', icon: '🛒', label: 'Groceries', active: true },
          { href: '/dashboard/history',   icon: '🕐', label: 'Order History' },
          { href: '/dashboard/billing',   icon: '💳', label: 'Billing' },
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

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: '36px 40px', overflow: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28 }}>🛒 Grocery Schedules</h1>
            <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 6 }}>
              Set up weekly or monthly grocery deliveries via Swiggy Instamart. Never run out of essentials.
            </p>
          </div>
          <Link href="/dashboard/groceries/new" className="btn btn-primary">+ New Grocery Schedule</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Active Schedules', value: '2',      icon: '📦', color: '#FF5F1F' },
            { label: 'This Month\'s Grocery Spend', value: '₹1,620', icon: '💰', color: '#22C55E' },
            { label: 'Items on Auto-order', value: '10',  icon: '🛍️', color: '#8B5CF6' },
          ].map((s, i) => (
            <div key={i} className="glass" style={{ padding: '22px', borderRadius: 18 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['schedules', 'bundles'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 20px', borderRadius: 10, fontWeight: 600, fontSize: 13,
              cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              background: activeTab === tab ? 'rgba(255,95,31,0.15)' : 'rgba(255,255,255,0.04)',
              color: activeTab === tab ? 'var(--brand-orange)' : 'var(--brand-muted)',
              borderWidth: 1, borderStyle: 'solid',
              borderColor: activeTab === tab ? 'rgba(255,95,31,0.4)' : 'var(--brand-border)',
            }}>
              {tab === 'schedules' ? '📋 My Schedules' : '📦 Quick Bundles'}
            </button>
          ))}
        </div>

        {/* My Schedules Tab */}
        {activeTab === 'schedules' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mockGroceryLists.map(g => (
              <div key={g.id} className="glass" style={{ borderRadius: 20, padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: 'linear-gradient(135deg, rgba(255,95,31,0.15), rgba(255,95,31,0.05))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                    }}>🛒</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{g.label}</div>
                      <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 3 }}>
                        {g.store} • {g.frequency} • ~₹{g.amount}/order
                      </div>
                    </div>
                  </div>
                  <span className={`badge badge-${g.status === 'active' ? 'success' : 'warn'}`}>{g.status}</span>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {g.items.map((item, i) => (
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

                {/* Next delivery + actions */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: 14, borderTop: '1px solid var(--brand-border)',
                }}>
                  <div style={{ fontSize: 13, color: 'var(--brand-muted)' }}>
                    📅 Next delivery: <strong style={{ color: 'var(--brand-text)' }}>{g.nextDelivery}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>Skip Once</button>
                    <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>Reschedule</button>
                    <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 12 }}>Order Now</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state hint */}
            <div className="glass" style={{
              borderRadius: 20, padding: '32px', textAlign: 'center',
              borderStyle: 'dashed', cursor: 'pointer',
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>➕</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Add another grocery schedule</div>
              <div style={{ color: 'var(--brand-muted)', fontSize: 13 }}>Weekly veggies, monthly staples, or custom bundles</div>
            </div>
          </div>
        )}

        {/* Quick Bundles Tab */}
        {activeTab === 'bundles' && (
          <div>
            <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginBottom: 20 }}>
              Start with a pre-built bundle and customise items later.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
              {popularBundles.map((b, i) => (
                <div key={i} className="glass" style={{
                  borderRadius: 18, padding: '24px',
                  transition: 'transform 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                >
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{b.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{b.name}</div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 12 }}>{b.items}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-orange)' }}>{b.price}</span>
                    <span className="badge badge-orange">{b.freq}</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                    Use this bundle →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
