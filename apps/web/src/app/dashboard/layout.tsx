'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

/* ── SVG Icons ─────────────────────────────────────────── */
const Icons = {
  grid: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  calendar: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2.5"/><line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/>
      <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  shopping: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  receipt: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2V2l-3 2-3-2-3 2-3-2-3 2z"/>
      <line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/>
    </svg>
  ),
  history: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
      <polyline points="12 7 12 12 15 14"/>
    </svg>
  ),
  settings: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
};

const NAV = [
  { href: '/dashboard',           label: 'Dashboard',  icon: 'grid',     section: null       },
  { href: '/dashboard/schedules', label: 'Meals',      icon: 'calendar', section: 'Automate' },
  { href: '/dashboard/groceries', label: 'Groceries',  icon: 'shopping', section: null       },
  { href: '/dashboard/warehouse', label: 'Warehouse',  icon: 'grid',     section: 'Testing'  },
  { href: '/dashboard/billing',   label: 'Billing',    icon: 'receipt',  section: 'Account'  },
  { href: '/dashboard/history',   label: 'History',    icon: 'history',  section: null       },
  { href: '/dashboard/settings',  label: 'Settings',   icon: 'settings', section: null       },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { data: session } = useSession();
  let currentSection = '';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* ── Sidebar (Hidden on Mobile) ─────────────────────────────────────── */}
      <aside className="hide-on-mobile" style={{
        width: 232, flexShrink: 0,
        background: 'linear-gradient(180deg, rgba(18,18,30,0.98) 0%, rgba(12,12,20,0.99) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        boxShadow: '1px 0 30px rgba(0,0,0,0.5)',
        /* ambient orange glow top-left */
        backgroundImage: 'radial-gradient(ellipse 120% 40% at 40% 0%, rgba(252,128,25,0.06) 0%, transparent 70%)',
      }}>

        {/* Logo */}
        <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            {/* Logo mark — layered glow */}
            <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
              <div style={{
                position: 'absolute', inset: '-4px',
                borderRadius: 14,
                background: 'radial-gradient(circle, rgba(252,128,25,0.25) 0%, transparent 70%)',
                animation: 'pulseGlow 2.5s ease-in-out infinite',
              }}/>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(252,128,25,0.25) 0%, rgba(211,84,0,0.15) 100%)',
                border: '1px solid rgba(252,128,25,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(252,128,25,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                position: 'relative', zIndex: 1,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FC8019" stroke="none">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: '#EEEEF5', letterSpacing: '-0.02em', lineHeight: 1 }}>Zautomeal</div>
              <div style={{ fontSize: 10, color: 'rgba(252,128,25,0.7)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>AI Powered</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding: '10px 10px', flex: 1 }}>
          {NAV.map((item, idx) => {
            const isActive = item.href === '/dashboard' ? path === '/dashboard' : path.startsWith(item.href);
            const showSection = item.section && item.section !== currentSection;
            if (showSection) currentSection = item.section!;

            return (
              <div key={item.href}>
                {showSection && (
                  <div style={{ padding: '14px 10px 6px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                    {item.section}
                  </div>
                )}
                <Link href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 10, marginBottom: 2,
                  textDecoration: 'none', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(252,128,25,0.14) 0%, rgba(252,128,25,0.06) 100%)'
                    : 'transparent',
                  color: isActive ? '#FC8019' : 'rgba(255,255,255,0.42)',
                  boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(252,128,25,0.18)' : 'none',
                }}>
                  {isActive && (
                    <>
                      <span style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:3, height:22, borderRadius:'0 3px 3px 0', background:'linear-gradient(180deg,#FC8019,#D35400)', boxShadow:'0 0 12px rgba(252,128,25,0.7)' }}/>
                      {/* subtle horizontal sheen */}
                      <span style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(252,128,25,0.04),transparent)', pointerEvents:'none' }}/>
                    </>
                  )}
                  <span style={{ display:'flex', alignItems:'center', flexShrink:0, opacity: isActive ? 1 : 0.65 }}>
                    {Icons[item.icon as keyof typeof Icons]}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, letterSpacing: '-0.005em' }}>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Upgrade card */}
        <div style={{ padding: '10px 12px' }}>
          <div style={{
            borderRadius: 14, padding: '16px',
            background: 'linear-gradient(135deg, rgba(252,128,25,0.08) 0%, rgba(211,84,0,0.04) 100%)',
            border: '1px solid rgba(252,128,25,0.18)',
            boxShadow: '0 0 30px rgba(252,128,25,0.05), inset 0 1px 0 rgba(255,255,255,0.06)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* decorative glow circle */}
            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:'radial-gradient(circle,rgba(252,128,25,0.15),transparent)', pointerEvents:'none' }}/>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#FC8019', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>Free Plan</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 12, lineHeight: 1.5 }}>Unlock grocery automation &amp; unlimited schedules.</div>
            <Link href="/dashboard/billing" className="btn btn-primary" style={{ width: '100%', padding: '8px 12px', fontSize: 12, justifyContent: 'center' }}>
              Upgrade →
            </Link>
          </div>
        </div>

        {/* User Profile */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>
          <Link href="/dashboard/settings" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', padding: '8px', borderRadius: 10, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {session?.user?.image ? (
                <img src={session.user.image} alt="User" style={{ width: '100%', height: '100%' }} />
              ) : (
                <span style={{ color: 'var(--c-text)', fontSize: 12, fontWeight: 700 }}>{session?.user?.name?.[0] || '?'}</span>
              )}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {session?.user?.name || 'Guest User'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--c-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {session?.user?.email || 'Not logged in'}
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {/* Mobile Header (Only visible on small screens) */}
        <div className="show-flex-mobile" style={{
          display: 'none', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px', borderBottom: '1px solid var(--c-border)',
          background: 'rgba(14,14,26,0.9)', backdropFilter: 'blur(10px)',
          position: 'sticky', top: 0, zIndex: 100
        }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(252,128,25,0.25) 0%, rgba(211,84,0,0.15) 100%)',
              border: '1px solid rgba(252,128,25,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FC8019" stroke="none">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: '#EEEEF5' }}>Zautomeal</span>
          </Link>
          <Link href="/dashboard/settings" style={{ width: 28, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {session?.user?.image ? (
              <img src={session.user.image} alt="User" style={{ width: '100%', height: '100%' }} />
            ) : (
              <span style={{ color: 'var(--c-text)', fontSize: 10, fontWeight: 700 }}>{session?.user?.name?.[0] || '?'}</span>
            )}
          </Link>
        </div>

        {children}
      </main>

      {/* ── Bottom Navigation Removed ──────────────── */}

    </div>
  );
}
