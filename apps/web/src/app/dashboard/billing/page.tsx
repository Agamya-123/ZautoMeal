'use client';
import { useState } from 'react';
import Link from 'next/link';

const plans = [
  { id: 'free', name: 'Free', price: 0, period: 'month', current: true, meals: { label: '1 meal schedule/day' }, groceries: { label: 'No grocery schedules' }, features: ['Push notifications', '7-day history', 'Basic skip/reschedule'] },
  { id: 'starter', name: 'Starter', price: 99, period: 'month', current: false, meals: { label: 'Up to 3 meals/day' }, groceries: { label: '1 grocery schedule (monthly)' }, features: ['WhatsApp alerts', '30-day history', 'Multi-address'] },
  { id: 'pro', name: 'Pro', price: 199, period: 'month', highlight: true, current: false, meals: { label: 'Unlimited meals' }, groceries: { label: 'Unlimited grocery schedules' }, features: ['Weekly & monthly grocery delivery', 'AI suggestions', 'Budget tracker', 'Family mode (2)', 'Priority support'] },
  { id: 'premium', name: 'Premium', price: 399, period: 'month', current: false, meals: { label: 'Unlimited meals' }, groceries: { label: 'Unlimited grocery schedules' }, features: ['Smart restocking AI', 'Family mode (5 members)', 'Custom cron rules', 'Dedicated support'] },
];

const usage = {
  meals:     { used: 1, limit: 1, spend: 4320 },
  groceries: { used: 0, limit: 0, spend: 1620 },
};

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'invoices'>('overview');
  const totalSpend = usage.meals.spend + usage.groceries.spend;

  return (
    <div style={{ padding: '36px 40px', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26, marginBottom: 6 }}>💳 Billing & Plans</h1>
      <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginBottom: 24 }}>Manage your subscription and track meal & grocery spending.</p>

      {/* Tabs */}
      <div style={{ display: 'inline-flex', marginBottom: 28, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--brand-border)', borderRadius: 12, overflow: 'hidden', padding: 3 }}>
        {(['overview', 'plans', 'invoices'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '7px 18px', borderRadius: 9, border: 'none', fontWeight: 600, fontSize: 13,
            cursor: 'pointer', transition: 'all 0.15s',
            background: activeTab === tab ? 'rgba(255,95,31,0.2)' : 'transparent',
            color: activeTab === tab ? 'var(--brand-orange)' : 'var(--brand-muted)',
          }}>
            {tab === 'overview' ? '📊 Overview' : tab === 'plans' ? '🚀 Plans' : '🧾 Invoices'}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <div className="glass" style={{ borderRadius: 18, padding: '22px 26px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,95,31,0.05)', border: '1px solid rgba(255,95,31,0.2)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>Current Plan: <span className="gradient-text">Free</span></div>
              <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 4 }}>No billing cycle • Upgrade anytime</div>
            </div>
            <button onClick={() => setActiveTab('plans')} className="btn btn-primary" style={{ fontSize: 13 }}>Upgrade Plan →</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {/* Meal usage */}
            <div className="glass" style={{ borderRadius: 16, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>🍽️ Meal Schedules</div>
                <span className="badge badge-orange">{usage.meals.used}/{usage.meals.limit}</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 12 }}>
                <div style={{ height: 5, borderRadius: 3, width: `${(usage.meals.used / usage.meals.limit) * 100}%`, background: 'linear-gradient(90deg,#FF5F1F,#FF7A45)' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--brand-muted)', borderTop: '1px solid var(--brand-border)', paddingTop: 10, marginTop: 4 }}>
                This month: <strong style={{ color: 'var(--brand-text)' }}>₹{usage.meals.spend.toLocaleString()}</strong>
              </div>
            </div>
            {/* Grocery usage */}
            <div className="glass" style={{ borderRadius: 16, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>🛒 Grocery Schedules</div>
                <span className="badge badge-warn">{usage.groceries.used}/{usage.groceries.limit}</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 12 }}>
                <div style={{ height: 5, borderRadius: 3, width: '0%', background: 'linear-gradient(90deg,#F59E0B,#FCD34D)' }} />
              </div>
              {usage.groceries.limit === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--brand-muted)' }}>
                  Not available on Free plan.{' '}
                  <button onClick={() => setActiveTab('plans')} style={{ background: 'none', border: 'none', color: 'var(--brand-orange)', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }}>Upgrade →</button>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--brand-muted)', borderTop: '1px solid var(--brand-border)', paddingTop: 10 }}>
                  This month: <strong style={{ color: 'var(--brand-text)' }}>₹{usage.groceries.spend.toLocaleString()}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Spend breakdown */}
          <div className="glass" style={{ borderRadius: 16, padding: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>📊 Monthly Spending Breakdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[
                { label: '🍽️ Meals this month',     value: `₹${usage.meals.spend.toLocaleString()}`,     color: '#FF5F1F' },
                { label: '🛒 Groceries this month', value: `₹${usage.groceries.spend.toLocaleString()}`, color: '#F59E0B' },
                { label: '💰 Total food spend',     value: `₹${totalSpend.toLocaleString()}`,             color: '#22C55E' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', border: '1px solid var(--brand-border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--brand-muted)', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PLANS */}
      {activeTab === 'plans' && (
        <div>
          <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginBottom: 24 }}>All plans include both <strong style={{ color: 'var(--brand-text)' }}>meal</strong> and <strong style={{ color: 'var(--brand-text)' }}>grocery</strong> automation (limits vary).</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
            {plans.map(plan => (
              <div key={plan.id} style={{
                background: (plan as any).highlight ? 'rgba(255,95,31,0.07)' : 'var(--brand-card)',
                border: `1px solid ${(plan as any).highlight ? 'rgba(255,95,31,0.4)' : plan.current ? 'rgba(34,197,94,0.4)' : 'var(--brand-border)'}`,
                borderRadius: 18, padding: '24px 20px', position: 'relative',
              }}>
                {(plan as any).highlight && <div className="badge badge-orange" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>Best Value</div>}
                {plan.current         && <div className="badge badge-success" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>Current</div>}
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{plan.name}</div>
                <div style={{ marginBottom: 18 }}>
                  <span style={{ fontSize: 32, fontWeight: 800 }}>{plan.price === 0 ? 'Free' : `₹${plan.price}`}</span>
                  {plan.price > 0 && <span style={{ color: 'var(--brand-muted)', fontSize: 12 }}>/{plan.period}</span>}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 9, padding: '10px', marginBottom: 14, border: '1px solid var(--brand-border)' }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 6, fontSize: 11 }}>
                    <span>🍽️</span><span style={{ color: 'var(--brand-success)' }}>{plan.meals.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: 11 }}>
                    <span>🛒</span><span style={{ color: plan.groceries.label.startsWith('No') ? 'var(--brand-danger)' : 'var(--brand-success)' }}>{plan.groceries.label}</span>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: 18 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 7, fontSize: 12, color: 'var(--brand-muted)' }}>
                      <span style={{ color: 'var(--brand-success)', flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button disabled={plan.current} style={{
                  width: '100%', padding: '10px', borderRadius: 10, fontWeight: 600, fontSize: 12,
                  cursor: plan.current ? 'default' : 'pointer',
                  background: plan.current ? 'rgba(255,255,255,0.04)' : (plan as any).highlight ? 'linear-gradient(135deg,#FF5F1F,#FF7A45)' : 'rgba(255,255,255,0.06)',
                  border: '1px solid ' + (plan.current ? 'var(--brand-border)' : 'transparent'),
                  color: plan.current ? 'var(--brand-muted)' : '#fff',
                }}>
                  {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'var(--brand-muted)', fontSize: 12, marginTop: 20 }}>Payments via Razorpay. Cancel anytime. No hidden charges.</p>
        </div>
      )}

      {/* INVOICES */}
      {activeTab === 'invoices' && (
        <div className="glass" style={{ borderRadius: 16, padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>🧾</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>No invoices yet</div>
          <div style={{ color: 'var(--brand-muted)', fontSize: 14 }}>You're on the Free plan. Upgrade to get monthly invoices.</div>
          <button onClick={() => setActiveTab('plans')} className="btn btn-primary" style={{ marginTop: 20 }}>View Plans →</button>
        </div>
      )}
    </div>
  );
}
