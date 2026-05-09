import Link from 'next/link';

export default function LoginPage() {
  return (
    <main style={{
      minHeight: '100vh', background: 'var(--brand-dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,95,31,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="glass animate-fade-up" style={{
        width: '100%', maxWidth: 420, borderRadius: 28, padding: '48px 40px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 28, marginBottom: 8 }}>
          Welcome to <span className="gradient-text">Zautomeal</span>
        </h1>
        <p style={{ color: 'var(--brand-muted)', fontSize: 14, marginBottom: 36, lineHeight: 1.6 }}>
          Sign in to start automating your Swiggy orders on a schedule.
        </p>

        {/* Google Sign In */}
        <button style={{
          width: '100%', padding: '14px', borderRadius: 14,
          background: '#fff', color: '#111', fontWeight: 600, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          border: 'none', cursor: 'pointer', marginBottom: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
          onClick={() => alert('Google OAuth — connect NextAuth.js here')}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.5 29.3 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.8 13.5-4.7l-6.2-5.2C29.3 35.6 26.8 36.5 24 36.5c-5.3 0-9.6-3.4-11.3-8.1l-6.6 5.1C9.5 39.4 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.7 6l6.2 5.2C40.2 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>

        {/* Dev bypass */}
        <Link href="/dashboard" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}>
          🛠️ Skip to Dashboard (Dev Mode)
        </Link>

        <p style={{ marginTop: 28, fontSize: 12, color: 'var(--brand-muted)', lineHeight: 1.6 }}>
          By continuing you agree to our Terms of Service.<br />
          We'll never place an order without your permission.
        </p>
      </div>
    </main>
  );
}
