import Link from 'next/link';

const plans = [
  {
    id: 'free', name: 'Free', price: 0, period: 'month',
    features: ['1 scheduled meal/day', 'Push notifications', '7-day order history'],
    current: true,
  },
  {
    id: 'starter', name: 'Starter', price: 99, period: 'month',
    features: ['3 meals/day', 'WhatsApp alerts', '30-day history', 'Multi-address'],
    current: false,
  },
  {
    id: 'pro', name: 'Pro', price: 199, period: 'month',
    features: ['Unlimited meals', 'AI meal suggestions', 'Budget tracker', 'Family mode (2 members)', 'Priority support'],
    highlight: true, current: false,
  },
  {
    id: 'premium', name: 'Premium', price: 399, period: 'month',
    features: ['Everything in Pro', 'Family mode (5 members)', 'Custom cron rules', 'Dedicated support', 'Early access to features'],
    current: false,
  },
];

export default function BillingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-dark)', padding: '40px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <Link href="/dashboard" style={{ color: 'var(--brand-muted)', textDecoration: 'none', fontSize: 14 }}>← Dashboard</Link>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>Billing & Plans</h1>
        </div>

        {/* Current plan info */}
        <div className="glass" style={{ borderRadius: 20, padding: '24px 28px', marginBottom: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Current Plan: <span className="gradient-text">Free</span></div>
            <div style={{ color: 'var(--brand-muted)', fontSize: 13, marginTop: 4 }}>1/1 meal schedule used • Renews never</div>
          </div>
          <span className="badge badge-success">Active</span>
        </div>

        {/* Plans grid */}
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
              <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, marginBottom: 9, fontSize: 13, color: 'var(--brand-muted)' }}>
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

        <p style={{ textAlign: 'center', color: 'var(--brand-muted)', fontSize: 12, marginTop: 24 }}>
          Payments via Razorpay. Cancel anytime. No hidden charges.
        </p>
      </div>
    </div>
  );
}
