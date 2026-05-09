'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ── Inline SVG icon set ──────────────────────────────────── */
const Icons = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/>
    </svg>
  ),
  shopping: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  receipt: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2V2l-3 2-3-2-3 2-3-2-3 2z"/>
      <line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/>
    </svg>
  ),
  history: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
      <polyline points="12 7 12 12 15 14"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  zap: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--c-orange)" stroke="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
};

const NAV = [
  { href: '/dashboard',           label: 'Dashboard',  icon: 'grid'     },
  { href: '/dashboard/schedules', label: 'Meals',      icon: 'calendar' },
  { href: '/dashboard/groceries', label: 'Groceries',  icon: 'shopping' },
  { href: '/dashboard/billing',   label: 'Billing',    icon: 'receipt'  },
  { href: '/dashboard/history',   label: 'History',    icon: 'history'  },
  { href: '/dashboard/settings',  label: 'Settings',   icon: 'settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--c-bg)' }}>
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside style={{
        width: 230, flexShrink: 0,
        background: 'var(--c-surface)',
        borderRight: '1px solid var(--c-border)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--c-border)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(252,128,25,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(252,128,25,0.25)', flexShrink: 0 }}>
              {Icons.zap}
            </div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, color: 'var(--c-text)', letterSpacing: '-0.01em' }}>Zautomeal</span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 10px', flex: 1 }}>
          <div className="section-label" style={{ padding: '0 10px', marginBottom: 8, marginTop: 4 }}>Navigation</div>
          {NAV.map(item => {
            const isActive = item.href === '/dashboard' ? path === '/dashboard' : path.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 9, marginBottom: 2,
                textDecoration: 'none', position: 'relative', overflow: 'hidden',
                transition: 'all var(--transition)',
                background: isActive ? 'rgba(252,128,25,0.1)' : 'transparent',
                color: isActive ? 'var(--c-orange)' : 'var(--c-muted)',
              }}>
                {isActive && <span className="nav-active-bar" />}
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {Icons[item.icon as keyof typeof Icons]}
                </span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade card */}
        <div style={{ padding: '12px 14px 20px' }}>
          <div style={{ borderRadius: 12, padding: '14px', background: 'rgba(252,128,25,0.06)', border: '1px solid rgba(252,128,25,0.15)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--c-orange)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Free Plan</div>
            <div style={{ fontSize: 12, color: 'var(--c-muted)', marginBottom: 10, lineHeight: 1.5 }}>Upgrade to unlock grocery automation & unlimited schedules.</div>
            <Link href="/dashboard/billing" className="btn btn-primary" style={{ width: '100%', padding: '8px 12px', fontSize: 12, justifyContent: 'center' }}>Upgrade →</Link>
          </div>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
