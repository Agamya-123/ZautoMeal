'use client';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    { icon: '⏰', title: 'Set it once', desc: 'Define your meal schedule with restaurant, items, and timing. Never think about it again.' },
    { icon: '🔔', title: '1-hour alert', desc: 'Get a WhatsApp or push notification before every order. Confirm, skip, or reschedule with one tap.' },
    { icon: '🛒', title: 'Monthly Groceries', desc: 'Schedule your full grocery basket for weekly or monthly auto-delivery via Swiggy Instamart. Never run out of essentials.' },
    { icon: '🤖', title: 'AI-powered', desc: 'Gemini AI understands natural commands: "Skip lunch Friday" or "Add milk to my weekly grocery list".' },
    { icon: '💰', title: 'Budget tracker', desc: 'Set separate budgets for meals and groceries. Get warned before you overspend on either.' },
    { icon: '🌦️', title: 'Weather-aware', desc: 'Suggests adjusted timing on rainy days when delivery takes longer.' },
    { icon: '👨‍👩‍👧', title: 'Family mode', desc: 'Manage meal & grocery schedules for everyone in the family from one dashboard.' },
    { icon: '📦', title: 'Smart restocking', desc: 'AI tracks your grocery consumption patterns and auto-adjusts quantities each month.' },
  ];

  const plans = [
    { name: 'Free',    price: '₹0',   period: '/month', features: ['1 meal/day', 'Push notifications', 'Basic history'],  cta: 'Get Started', highlight: false },
    { name: 'Starter', price: '₹99',  period: '/month', features: ['3 meals/day', 'WhatsApp alerts', '1 grocery schedule (monthly)', '30-day history'], cta: 'Get Starter', highlight: false },
    { name: 'Pro',     price: '₹199', period: '/month', features: ['Unlimited meals', 'Unlimited grocery schedules', 'Weekly & monthly delivery', 'AI suggestions', 'Budget tracker', 'Multi-address'], cta: 'Go Pro', highlight: true },
    { name: 'Premium', price: '₹399', period: '/month', features: ['Everything in Pro', 'Family mode (5 members)', 'Smart restocking AI', 'Priority support', 'Custom rules'], cta: 'Go Premium', highlight: false },
  ];

  const tabs = [
    { label: '🍽️ Meals', active: true },
    { label: '🛒 Groceries', active: false },
  ];

  return (
    <main style={{ minHeight: '100vh', background: 'var(--brand-dark)' }}>
      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px',
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--brand-border)',
        gap: 16,
      }}>
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22 }}>
          🍽️ <span className="gradient-text">Zautomeal</span>
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/dashboard" className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: 13 }}>Dashboard</Link>
          <Link href="/login" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Get Started →</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        paddingTop: 160, paddingBottom: 100, textAlign: 'center',
        maxWidth: 760, margin: '0 auto', padding: '160px 24px 100px',
      }}>
        <div className="badge badge-orange animate-fade-up" style={{ marginBottom: 24, fontSize: 12 }}>
          🚀 Powered by Swiggy Builder API + Gemini AI
        </div>
        <h1 className="animate-fade-up" style={{
          fontFamily: 'Space Grotesk', fontSize: 'clamp(42px, 7vw, 72px)',
          fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
          animationDelay: '0.1s',
        }}>
          Automate your hunger.<br />
          <span className="gradient-text">Eat on schedule.</span>
        </h1>
        <p className="animate-fade-up" style={{
          fontSize: 18, color: 'var(--brand-muted)', lineHeight: 1.7,
          marginBottom: 40, animationDelay: '0.2s',
        }}>
          Set your meal schedule once. Zautomeal places your Swiggy orders automatically,
          sends a 1-hour heads-up, and lets you skip or reschedule with one tap.
        </p>
        <div className="animate-fade-up" style={{ display: 'flex', gap: 12, justifyContent: 'center', animationDelay: '0.3s' }}>
          <Link href="/login" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
            Start Automating Free →
          </Link>
          <Link href="#how" className="btn btn-ghost" style={{ fontSize: 16, padding: '14px 32px' }}>
            See How It Works
          </Link>
        </div>

        {/* ── Mock Phone UI ── */}
        <div className="animate-fade-up" style={{
          marginTop: 72, animationDelay: '0.4s',
          background: 'var(--brand-card)', borderRadius: 24,
          border: '1px solid var(--brand-border)',
          padding: '24px', maxWidth: 420, margin: '72px auto 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #FF5F1F, #FF9A6C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>🍔</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Zautomeal</div>
              <div style={{ color: 'var(--brand-muted)', fontSize: 12 }}>Now • WhatsApp</div>
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: 16,
            padding: '16px', textAlign: 'left', marginBottom: 16, fontSize: 14, lineHeight: 1.6,
          }}>
            🍽️ Your <strong>"Work Lunch"</strong> from Burger King is being placed in <strong>1 hour</strong>.
            <br />Want it today?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['✅ Yes', '⏭️ Skip', '🔄 Reschedule'].map(action => (
              <button key={action} style={{
                flex: 1, padding: '10px 4px', borderRadius: 10,
                background: 'rgba(255,95,31,0.1)', border: '1px solid rgba(255,95,31,0.3)',
                color: 'var(--brand-orange)', fontWeight: 600, fontSize: 12, cursor: 'pointer',
              }}>{action}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="how" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 700, marginBottom: 56 }}>
          Everything you need. <span className="gradient-text">Nothing you don't.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="glass" style={{
              padding: '28px', borderRadius: 20,
              transition: 'transform 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--brand-muted)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 700, marginBottom: 56 }}>
          Simple, honest <span className="gradient-text">pricing</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {plans.map((plan, i) => (
            <div key={i} style={{
              background: plan.highlight ? 'rgba(255,95,31,0.08)' : 'var(--brand-card)',
              border: `1px solid ${plan.highlight ? 'rgba(255,95,31,0.4)' : 'var(--brand-border)'}`,
              borderRadius: 24, padding: '32px 28px', position: 'relative',
            }}>
              {plan.highlight && (
                <div className="badge badge-orange" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
                  Most Popular
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 40, fontWeight: 800 }}>{plan.price}</span>
                <span style={{ color: 'var(--brand-muted)', fontSize: 14 }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 14, color: 'var(--brand-muted)' }}>
                    <span style={{ color: 'var(--brand-success)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="btn" style={{
                width: '100%', justifyContent: 'center',
                background: plan.highlight ? 'linear-gradient(135deg, #FF5F1F, #FF7A45)' : 'rgba(255,255,255,0.06)',
                color: '#fff', boxShadow: plan.highlight ? '0 4px 24px rgba(255,95,31,0.35)' : 'none',
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--brand-border)', padding: '32px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--brand-muted)', fontSize: 13,
      }}>
        <span>🍽️ <strong style={{ color: 'var(--brand-text)' }}>Zautomeal</strong> — Automate your hunger.</span>
        <span>MIT License • Built with ❤️</span>
      </footer>
    </main>
  );
}
