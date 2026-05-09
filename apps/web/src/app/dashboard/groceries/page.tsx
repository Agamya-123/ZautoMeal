'use client';
import { useState } from 'react';
import Link from 'next/link';

const mockGroceryLists = [
  { id: 'g1', label: 'Monthly Kitchen Essentials', frequency: 'Monthly', nextDelivery: '1st Jun 2026', items: ['Basmati Rice 5kg', 'Toor Dal 2kg', 'Mustard Oil 1L', 'Sugar 2kg', 'Salt 1kg'], amount: 1240, store: 'Swiggy Instamart', status: 'active' },
  { id: 'g2', label: 'Weekly Fresh Produce',       frequency: 'Weekly',  nextDelivery: 'Sat, 10 May',  items: ['Tomatoes 1kg', 'Onions 1kg', 'Spinach 500g', 'Milk 2L', 'Curd 400g'],          amount: 380,  store: 'Swiggy Instamart', status: 'active' },
];

const popularBundles = [
  { icon: '🍚', name: 'Kitchen Staples', items: 'Rice, Dal, Oil, Spices',      price: '₹1,200–1,500', freq: 'Monthly' },
  { icon: '🥛', name: 'Daily Dairy',     items: 'Milk, Curd, Butter, Paneer',  price: '₹600–800',     freq: 'Weekly'  },
  { icon: '🥦', name: 'Fresh Veggies',   items: 'Seasonal vegetables, Herbs',  price: '₹300–500',     freq: 'Weekly'  },
  { icon: '🧴', name: 'Home Essentials', items: 'Soap, Shampoo, Detergent',    price: '₹800–1,200',   freq: 'Monthly' },
];

export default function GroceriesPage() {
  const [activeTab, setActiveTab] = useState<'schedules' | 'bundles'>('schedules');

  return (
    <div style={{ padding: '36px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>🛒 Grocery Schedules</h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginTop: 6 }}>Set up weekly or monthly grocery deliveries via Swiggy Instamart. Never run out of essentials.</p>
        </div>
        <Link href="/dashboard/groceries/new" className="btn btn-primary">+ New Grocery Schedule</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Active Schedules',          value: '2',       icon: '📦', color: '#FF5F1F' },
          { label: "This Month's Grocery Spend", value: '₹1,620', icon: '💰', color: '#22C55E' },
          { label: 'Items on Auto-order',        value: '10',      icon: '🛍️', color: '#8B5CF6' },
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

      {/* My Schedules */}
      {activeTab === 'schedules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mockGroceryLists.map(g => (
            <div key={g.id} className="glass" style={{ borderRadius: 18, padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🛒</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{g.label}</div>
                    <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 2 }}>{g.store} • {g.frequency} • ~₹{g.amount}/order</div>
                  </div>
                </div>
                <span className={`badge badge-${g.status === 'active' ? 'success' : 'warn'}`}>{g.status}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {g.items.map((item, i) => (
                  <span key={i} style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--brand-border)', color: 'var(--brand-muted)' }}>{item}</span>
                ))}
                <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E', cursor: 'pointer' }}>+ Edit items</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--brand-border)' }}>
                <div style={{ fontSize: 13, color: 'var(--brand-muted)' }}>📅 Next: <strong style={{ color: 'var(--brand-text)' }}>{g.nextDelivery}</strong></div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost"   style={{ padding: '7px 14px', fontSize: 12 }}>Skip Once</button>
                  <button className="btn btn-ghost"   style={{ padding: '7px 14px', fontSize: 12 }}>Reschedule</button>
                  <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 12 }}>Order Now</button>
                </div>
              </div>
            </div>
          ))}
          <div className="glass" style={{ borderRadius: 18, padding: '28px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>➕</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Add another grocery schedule</div>
            <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 16 }}>Weekly veggies, monthly staples, or custom bundles.</div>
            <Link href="/dashboard/groceries/new" className="btn btn-primary" style={{ fontSize: 13 }}>Create Schedule →</Link>
          </div>
        </div>
      )}

      {/* Quick Bundles */}
      {activeTab === 'bundles' && (
        <div>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginBottom: 20 }}>Start with a pre-built bundle and customise items later.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
            {popularBundles.map((b, i) => (
              <div key={i} className="glass" style={{ borderRadius: 16, padding: '22px', transition: 'transform 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{b.name}</div>
                <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginBottom: 12 }}>{b.items}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand-orange)', fontSize: 13 }}>{b.price}</span>
                  <span className="badge badge-orange">{b.freq}</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>Use this bundle →</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
