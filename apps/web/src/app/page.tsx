'use client';
import Link from 'next/link';

/* ── SVG Icons ─────────────────────────────────────────── */
const Icons = {
  logo: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#FC8019" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  clock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  bell: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  cart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  ai: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/><path d="M2 12h20"/></svg>, // Simple bot/AI representation
  money: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  weather: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16.2A4.5 4.5 0 0017.5 8h-1.8A7 7 0 104 14.9"/><path d="M16 22v-6"/><path d="M8 22v-6"/><path d="M12 22v-8"/></svg>,
  users: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  box: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  truck: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
};

export default function LandingPage() {
  const features = [
    { icon: <Icons.clock />, title: 'Set it once', desc: 'Define your meal schedule with restaurant, items, and timing. Never think about it again.' },
    { icon: <Icons.bell />, title: '1-hour alert', desc: 'Get a WhatsApp or push notification before every order. Confirm, skip, or reschedule with one tap.' },
    { icon: <Icons.cart />, title: 'Monthly Groceries', desc: 'Schedule your full grocery basket for weekly or monthly auto-delivery via Swiggy Instamart.' },
    { icon: <Icons.ai />, title: 'AI-powered', desc: 'Gemini AI understands natural commands: "Skip lunch Friday" or "Add milk to my weekly list".' },
    { icon: <Icons.money />, title: 'Budget tracker', desc: 'Set separate budgets for meals and groceries. Get warned before you overspend on either.' },
    { icon: <Icons.weather />, title: 'Weather-aware', desc: 'Suggests adjusted timing on rainy days when delivery takes longer.' },
    { icon: <Icons.users />, title: 'Family mode', desc: 'Manage meal & grocery schedules for everyone in the family from one dashboard.' },
    { icon: <Icons.box />, title: 'Smart restocking', desc: 'AI tracks your grocery consumption patterns and auto-adjusts quantities each month.' },
  ];

  const plans = [
    { name: 'Free',    price: '₹0',   period: '/month', features: ['1 meal/day', 'Push notifications', 'Basic history'], cta: 'Get Started', highlight: false },
    { name: 'Starter', price: '₹99',  period: '/month', features: ['3 meals/day', 'WhatsApp alerts', '1 grocery schedule', '30-day history'], cta: 'Get Starter', highlight: false },
    { name: 'Pro',     price: '₹199', period: '/month', features: ['Unlimited meals', 'Unlimited groceries', 'Weekly & monthly delivery', 'AI suggestions', 'Budget tracker'], cta: 'Go Pro', highlight: true },
    { name: 'Premium', price: '₹399', period: '/month', features: ['Everything in Pro', 'Family mode (5 members)', 'Smart restocking AI', 'Priority support'], cta: 'Go Premium', highlight: false },
  ];

  return (
    <main style={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px',
        background: 'rgba(8,8,16,0.7)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: 32, height: 32, flexShrink: 0 }}>
              <div style={{
                position: 'absolute', inset: '-4px', borderRadius: 14,
                background: 'radial-gradient(circle, rgba(252,128,25,0.25) 0%, transparent 70%)',
              }}/>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(252,128,25,0.25) 0%, rgba(211,84,0,0.15) 100%)',
                border: '1px solid rgba(252,128,25,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 1,
              }}>
                <Icons.logo />
              </div>
            </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, color: 'var(--c-text)', letterSpacing: '-0.02em' }}>
            Zautomeal
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/dashboard" className="btn btn-ghost">Dashboard</Link>
          <Link href="/login"     className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 180, paddingBottom: 80, textAlign: 'center', maxWidth: 860, margin: '0 auto', padding: '180px 24px 80px', position: 'relative' }}>
        
        {/* Glows */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(252,128,25,0.15), transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: -1 }} />

        <div className="badge badge-orange animate-fade-up" style={{ marginBottom: 28, fontSize: 11, padding: '6px 14px', borderRadius: 99, background: 'rgba(252,128,25,0.08)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icons.logo /> Powered by Swiggy Builder API + Gemini AI</span>
        </div>
        <h1 className="animate-fade-up" style={{
          fontFamily: 'Space Grotesk', fontSize: 'clamp(44px, 7vw, 76px)',
          fontWeight: 800, lineHeight: 1.05, marginBottom: 28, animationDelay: '0.1s',
          letterSpacing: '-0.03em'
        }}>
          Automate your hunger.<br />
          <span className="gradient-text">Eat on schedule.</span>
        </h1>
        <p className="animate-fade-up" style={{
          fontSize: 19, color: 'var(--c-muted)', lineHeight: 1.7,
          marginBottom: 44, animationDelay: '0.2s', maxWidth: 680, margin: '0 auto 44px'
        }}>
          Set your meal & grocery schedules once. Zautomeal places your Swiggy orders automatically,
          sends a 1-hour heads-up, and lets you skip or reschedule with one tap.
        </p>
        <div className="animate-fade-up" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }}>
          <Link href="/login" className="btn btn-primary" style={{ fontSize: 16, padding: '16px 36px', borderRadius: 14 }}>Start Automating</Link>
          <Link href="#features" className="btn btn-ghost" style={{ fontSize: 16, padding: '16px 36px', borderRadius: 14 }}>See Features</Link>
        </div>

        {/* ── Mock UI Cards container ── */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginTop: 80, perspective: 1000 }}>
          
          {/* Meal Card */}
          <div className="luxury-card animate-float" style={{ padding: '24px', width: 360, textAlign: 'left', animationDelay: '0.4s', transformStyle: 'preserve-3d' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(252,128,25,0.15) 0%, rgba(211,84,0,0.05) 100%)',
                border: '1px solid rgba(252,128,25,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FC8019'
              }}><Icons.truck /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Burger King</div>
                <div style={{ color: 'var(--c-muted)', fontSize: 12 }}>Work Lunch • 1:00 PM</div>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 12,
              padding: '14px', fontSize: 13, lineHeight: 1.6, marginBottom: 16, border: '1px solid var(--c-border)'
            }}>
              Your order for <strong>Whopper + Medium Fries</strong> is being placed in <strong>1 hour</strong>.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Confirm', 'Skip', 'Delay'].map((action, i) => (
                <button key={action} style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 12, fontWeight: 600,
                  background: i===0 ? 'rgba(252,128,25,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${i===0 ? 'rgba(252,128,25,0.3)' : 'var(--c-border)'}`,
                  color: i===0 ? '#FC8019' : 'var(--c-text)', cursor: 'pointer', transition: 'all 0.2s',
                }}>{action}</button>
              ))}
            </div>
          </div>

          {/* Grocery Card */}
          <div className="luxury-card animate-float" style={{ padding: '24px', width: 360, textAlign: 'left', animationDelay: '0.6s', transformStyle: 'preserve-3d', animationDuration: '3.5s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(0,230,118,0.15) 0%, rgba(0,184,90,0.05) 100%)',
                border: '1px solid rgba(0,230,118,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00E676'
              }}><Icons.cart /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Swiggy Instamart</div>
                <div style={{ color: 'var(--c-muted)', fontSize: 12 }}>Monthly Essentials • 1st Jun</div>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 12,
              padding: '14px', fontSize: 13, lineHeight: 1.6, border: '1px solid var(--c-border)', marginBottom: 16
            }}>
              Your <strong>Monthly Kitchen Staples</strong> (Rice, Dal, Oil...) will arrive tomorrow morning.
            </div>
            <button className="btn btn-green" style={{ width: '100%', padding: '10px 0', fontSize: 12 }}>Review Items & Confirm</button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Space Grotesk', fontSize: 40, fontWeight: 800, marginBottom: 70, letterSpacing: '-0.02em' }}>
          Everything you need.<br/><span className="gradient-text">Nothing you don't.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="stat-card" style={{ padding: '32px 24px' }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.04)', 
                border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', color: 'var(--c-orange)', marginBottom: 20 
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: 'var(--c-muted)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ padding: '100px 24px', maxWidth: 1040, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'Space Grotesk', fontSize: 40, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Simple, honest <span className="gradient-text">pricing</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--c-muted)', fontSize: 16, marginBottom: 60 }}>
          All plans include both meal automation and grocery scheduling.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, alignItems: 'center' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{
              background: plan.highlight ? 'linear-gradient(145deg, rgba(252,128,25,0.08) 0%, rgba(211,84,0,0.02) 100%)' : 'var(--c-card)',
              border: `1px solid ${plan.highlight ? 'rgba(252,128,25,0.35)' : 'var(--c-border)'}`,
              borderRadius: 24, padding: plan.highlight ? '44px 28px' : '36px 28px', position: 'relative',
              boxShadow: plan.highlight ? '0 0 50px rgba(252,128,25,0.08), inset 0 1px 0 rgba(255,255,255,0.08)' : 'inset 0 1px 0 rgba(255,255,255,0.04)',
              transform: plan.highlight ? 'scale(1.02)' : 'scale(1)',
              zIndex: plan.highlight ? 10 : 1
            }}>
              {plan.highlight && (
                <div className="badge badge-orange" style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '6px 14px', fontSize: 11, boxShadow: '0 4px 12px rgba(252,128,25,0.3)' }}>
                  Most Popular
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, fontFamily: 'Space Grotesk' }}>{plan.name}</div>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Space Grotesk', letterSpacing: '-0.04em' }}>{plan.price}</span>
                <span style={{ color: 'var(--c-muted)', fontSize: 13 }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: 32 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, fontSize: 13, color: 'var(--c-muted)' }}>
                    <span style={{ color: 'var(--c-green)', flexShrink: 0, marginTop: 1 }}><Icons.check /></span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="btn" style={{
                width: '100%', justifyContent: 'center', padding: '14px', borderRadius: 12, fontSize: 14,
                background: plan.highlight ? 'linear-gradient(135deg, var(--c-orange) 0%, var(--c-orange-dim) 100%)' : 'rgba(255,255,255,0.06)',
                color: '#fff', border: plan.highlight ? 'none' : '1px solid var(--c-border)',
                boxShadow: plan.highlight ? '0 8px 24px rgba(252,128,25,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--c-border)', padding: '40px 48px', marginTop: 80,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--c-muted)', fontSize: 13, flexWrap: 'wrap', gap: 16,
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 24, height: 24, background: 'rgba(252,128,25,0.1)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(252,128,25,0.2)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#FC8019" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <span><strong style={{ color: 'var(--c-text)' }}>Zautomeal</strong> — Digital Precision Automation.</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="#" style={{ color: 'var(--c-muted)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="#" style={{ color: 'var(--c-muted)', textDecoration: 'none' }}>Terms</Link>
          <span>Built with Next.js</span>
        </div>
      </footer>
    </main>
  );
}
