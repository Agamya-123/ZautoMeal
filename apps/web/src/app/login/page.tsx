'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

const IcGoogle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Navbar Minimal */}
      <nav style={{ padding: '24px 48px', position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, rgba(252,128,25,0.25) 0%, rgba(211,84,0,0.15) 100%)', border: '1px solid rgba(252,128,25,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#FC8019" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, color: 'var(--c-text)', letterSpacing: '-0.02em' }}>
            Zautomeal
          </span>
        </Link>
      </nav>

      {/* Ambient Glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(252,128,25,0.12), transparent 70%)', filter: 'blur(60px)', zIndex: -1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,230,118,0.08), transparent 70%)', filter: 'blur(60px)', zIndex: -1, pointerEvents: 'none' }} />

      {/* Login Box */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="luxury-card animate-fade-up" style={{ width: '100%', maxWidth: 440, padding: '48px 40px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--c-muted)', fontSize: 15, marginBottom: 40, lineHeight: 1.6 }}>
            Sign in to manage your automated meals and grocery schedules.
          </p>

          <button 
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--c-border)', color: 'var(--c-text)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              marginBottom: 12
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'var(--c-border)';
            }}
          >
            <IcGoogle /> Continue with Google
          </button>

          <button 
            onClick={() => signIn('credentials', { email: 'test@example.com', password: 'password', callbackUrl: '/dashboard' })}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(252,128,25,0.2) 0%, rgba(211,84,0,0.1) 100%)', 
              border: '1px solid rgba(252,128,25,0.3)', color: '#FC8019',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(252,128,25,0.3) 0%, rgba(211,84,0,0.2) 100%)';
              e.currentTarget.style.borderColor = 'rgba(252,128,25,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(252,128,25,0.2) 0%, rgba(211,84,0,0.1) 100%)';
              e.currentTarget.style.borderColor = 'rgba(252,128,25,0.3)';
            }}
          >
            🚀 Continue as Test User
          </button>

          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--c-border)' }}>
            <p style={{ fontSize: 12, color: 'var(--c-muted)', lineHeight: 1.6 }}>
              By signing in, you agree to our <a href="#" style={{ color: '#FC8019', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: '#FC8019', textDecoration: 'none' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
