'use client';
import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    id: 'free', name: 'Free', price: 0, period: 'month', current: true,
    meals:     { limit: 1,   label: '1 meal schedule/day' },
    groceries: { limit: 0,   label: 'No grocery schedules' },
    features: ['Push notifications', '7-day history', 'Basic skip/reschedule'],
  },
  {
    id: 'starter', name: 'Starter', price: 99, period: 'month', current: false,
    meals:     { limit: 3,   label: 'Up to 3 meals/day' },
    groceries: { limit: 1,   label: '1 grocery schedule (monthly)' },
    features: ['WhatsApp alerts', '30-day history', 'Multi-address'],
  },
  {
    id: 'pro', name: 'Pro', price: 199, period: 'month', highlight: true, current: false,
    meals:     { limit: -1,  label: 'Unlimited meals' },
    groceries: { limit: -1,  label: 'Unlimited grocery schedules' },
    features: ['Weekly & monthly grocery delivery', 'AI suggestions', 'Budget tracker', 'Family mode (2)', 'Priority support'],
  },
  {
    id: 'premium', name: 'Premium', price: 399, period: 'month', current: false,
    meals:     { limit: -1,  label: 'Unlimited meals' },
    groceries: { limit: -1,  label: 'Unlimited grocery schedules' },
    features: ['Smart restocking AI', 'Family mode (5 members)', 'Custom cron rules', 'Dedicated support', 'Early access'],
  },
];

// Mock usage data
const usage = {
  plan: 'Free',
  billing: { nextDate: null as string | null, amount: 0 },
  meals:     { used: 1, limit: 1, schedules: ['Work Lunch'] },
  groceries: { used: 0, limit: 0, schedules: [] as string[] },
  spending: {
    meals:     { thisMonth: 4320, lastMonth: 3890 },
    groceries: { thisMonth: 1620, lastMonth: 1540 },
  },
};

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'invoices'>('overview');
  const totalSpend = usage.spending.meals.thisMonth + usage.spending.groceries.thisMonth;

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
          { href: '/dashboard/billing',   icon: '💳', label: 'Billing', active: true },
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
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, marginBottom: 6 }}>💳 Billing & Plans</h1>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginBottom: 28 }}>
            Manage your subscription, track meal & grocery spending.
          </p>

          {/* ── Tabs ── */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {(['overview', 'plans', 'invoices'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '8px 20px', borderRadius: 10, fontWeight: 600, fontSize: 13,
                cursor: 'pointer', border: 'none', transition: 'all 0.2s', textTransform: 'capitalize',
                background: activeTab === tab ? 'rgba(255,95,31,0.15)' : 'rgba(255,255,255,0.04)',
                color: activeTab === tab ? 'var(--brand-orange)' : 'var(--brand-muted)',
                outline: `1px solid ${activeTab === tab ? 'rgba(255,95,31,0.4)' : 'var(--brand-border)'}`,
              }}>
                {tab === 'overview' ? '📊 Overview' : tab === 'plans' ? '🚀 Plans' : '🧾 Invoices'}
              </button>
            ))}
          </div>

          {/* ════════════════════════════════════════════
              TAB: OVERVIEW
          ════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div>
              {/* Current plan banner */}
              <div className="glass" style={{
                borderRadius: 20, padding: '24px 28px', marginBottom: 24,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(255,95,31,0.05)', border: '1px solid rgba(255,95,31,0.2)',
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>
                    Current Plan: <span className="gradient-text">Free</span>
                  </div>
                  <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 4 }}>
                    No billing cycle • Upgrade anytime to unlock more
                  </div>
                </div>
                <button onClick={() => setActiveTab('plans')} className="btn btn-primary" style={{ fontSize: 13 }}>
                  Upgrade Plan →
                </button>
              </div>

              {/* Usage: Meals + Groceries side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

                {/* Meal usage */}
                <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>🍽️ Meal Schedules</div>
                    <span className="badge badge-orange">{usage.meals.used}/{usage.meals.limit === -1 ? '∞' : usage.meals.limit}</span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 12 }}>
                    <div style={{
                      height: 6, borderRadius: 3,
                      width: `${usage.meals.limit === -1 ? 30 : (usage.meals.used / usage.meals.limit) * 100}%`,
                      background: 'linear-gradient(90deg, #FF5F1F, #FF7A45)',
                    }} />
                  </div>
                  {usage.meals.schedules.length > 0 ? (
                    <ul style={{ listStyle: 'none', fontSize: 13, color: 'var(--brand-muted)' }}>
                      {usage.meals.schedules.map((s, i) => (
                        <li key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                          <span style={{ color: 'var(--brand-success)' }}>✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: 13, color: 'var(--brand-muted)' }}>No active meal schedules</p>
                  )}
                  <div style={{ marginTop: 14, fontSize: 12, color: 'var(--brand-muted)', borderTop: '1px solid var(--brand-border)', paddingTop: 12 }}>
                    This month's spend: <strong style={{ color: 'var(--brand-text)' }}>₹{usage.spending.meals.thisMonth.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Grocery usage */}
                <div className="glass" style={{ borderRadius: 18, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>🛒 Grocery Schedules</div>
                    <span className="badge badge-warn">{usage.groceries.used}/{usage.groceries.limit === -1 ? '∞' : usage.groceries.limit === 0 ? '0' : usage.groceries.limit}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 12 }}>
                    <div style={{
                      height: 6, borderRadius: 3, width: '0%',
                      background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
                    }} />
                  </div>
                  {usage.groceries.limit === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--brand-muted)', lineHeight: 1.6 }}>
                      Grocery schedules not included in Free plan.
                      <br />
                      <button onClick={() => setActiveTab('plans')} style={{
                        background: 'none', border: 'none', color: 'var(--brand-orange)', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, padding: 0, marginTop: 4,
                      }}>Upgrade to Starter →</button>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: 'var(--brand-muted)' }}>No active grocery schedules</p>
                  )}
                  <div style={{ marginTop: 14, fontSize: 12, color: 'var(--brand-muted)', borderTop: '1px solid var(--brand-border)', paddingTop: 12 }}>
                    This month's spend: <strong style={{ color: 'var(--brand-text)' }}>₹{usage.spending.groceries.thisMonth.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Combined spend summary */}
              <div className="glass" style={{ borderRadius: 18, padding: '24px', marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📊 Monthly Spending Breakdown</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {[
                    { label: '🍽️ Meals this month',     value: `₹${usage.spending.meals.thisMonth.toLocaleString()}`,     sub: `↑ ₹${(usage.spending.meals.thisMonth - usage.spending.meals.lastMonth).toLocaleString()} vs last month`, color: '#FF5F1F' },
                    { label: '🛒 Groceries this month', value: `₹${usage.spending.groceries.thisMonth.toLocaleString()}`, sub: `↑ ₹${(usage.spending.groceries.thisMonth - usage.spending.groceries.lastMonth).toLocaleString()} vs last month`, color: '#F59E0B' },
                    { label: '💰 Total food spend',     value: `₹${totalSpend.toLocaleString()}`,                          sub: 'Meals + Groceries combined', color: '#22C55E' },
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '16px', border: '1px solid var(--brand-border)' }}>
                      <div style={{ fontSize: 12, color: 'var(--brand-muted)', marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginTop: 4 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════
              TAB: PLANS
          ════════════════════════════════════════════ */}
          {activeTab === 'plans' && (
            <div>
              <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginBottom: 24 }}>
                All plans include both <strong style={{ color: 'var(--brand-text)' }}>meal</strong> and <strong style={{ color: 'var(--brand-text)' }}>grocery</strong> automation (limits vary).
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {plans.map(plan => (
                  <div key={plan.id} style={{
                    background: (plan as any).highlight ? 'rgba(255,95,31,0.07)' : 'var(--brand-card)',
                    border: `1px solid ${(plan as any).highlight ? 'rgba(255,95,31,0.4)' : plan.current ? 'rgba(34,197,94,0.4)' : 'var(--brand-border)'}`,
                    borderRadius: 20, padding: '28px 22px', position: 'relative',
                  }}>
                    {(plan as any).highlight && (
                      <div className="badge badge-orange" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>Best Value</div>
                    )}
                    {plan.current && (
                      <div className="badge badge-success" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>Current</div>
                    )}

                    <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{plan.name}</div>
                    <div style={{ marginBottom: 20 }}>
                      <span style={{ fontSize: 34, fontWeight: 800 }}>{plan.price === 0 ? 'Free' : `₹${plan.price}`}</span>
                      {plan.price > 0 && <span style={{ color: 'var(--brand-muted)', fontSize: 13 }}>/{plan.period}</span>}
                    </div>

                    {/* Meals + Groceries limits */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px', marginBottom: 16, border: '1px solid var(--brand-border)' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, fontSize: 12 }}>
                        <span>🍽️</span>
                        <span style={{ color: plan.meals.limit !== 0 ? 'var(--brand-success)' : 'var(--brand-muted)' }}>
                          {plan.meals.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
                        <span>🛒</span>
                        <span style={{ color: plan.groceries.limit !== 0 ? 'var(--brand-success)' : 'var(--brand-danger)' }}>
                          {plan.groceries.label}
                        </span>
                      </div>
                    </div>

                    <ul style={{ listStyle: 'none', marginBottom: 20 }}>
                      {plan.features.map((f, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, color: 'var(--brand-muted)' }}>
                          <span style={{ color: 'var(--brand-success)', flexShrink: 0 }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      disabled={plan.current}
                      style={{
                        width: '100%', padding: '11px', borderRadius: 12, fontWeight: 600, fontSize: 13,
                        cursor: plan.current ? 'default' : 'pointer',
                        background: plan.current ? 'rgba(255,255,255,0.04)' : (plan as any).highlight ? 'linear-gradient(135deg, #FF5F1F, #FF7A45)' : 'rgba(255,255,255,0.06)',
                        border: '1px solid ' + (plan.current ? 'var(--brand-border)' : 'transparent'),
                        color: plan.current ? 'var(--brand-muted)' : '#fff',
                      }}
                    >
                      {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                ))}
              </div>
              <p style={{ textAlign: 'center', color: 'var(--brand-muted)', fontSize: 12, marginTop: 20 }}>
                Payments via Razorpay. Cancel anytime. No hidden charges.
              </p>
            </div>
          )}

          {/* ════════════════════════════════════════════
              TAB: INVOICES
          ════════════════════════════════════════════ */}
          {activeTab === 'invoices' && (
            <div>
              <div className="glass" style={{ borderRadius: 18, padding: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>🧾</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>No invoices yet</div>
                <div style={{ color: 'var(--brand-muted)', fontSize: 14 }}>
                  You're on the Free plan. Upgrade to get monthly invoices for your subscription.
                </div>
                <button onClick={() => setActiveTab('plans')} className="btn btn-primary" style={{ marginTop: 20 }}>
                  View Plans →
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
