'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard',           icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/schedules', icon: '📅', label: 'Meal Schedules' },
  { href: '/dashboard/groceries', icon: '🛒', label: 'Groceries' },
  { href: '/dashboard/history',   icon: '🕐', label: 'Order History' },
  { href: '/dashboard/billing',   icon: '💳', label: 'Billing' },
  { href: '/dashboard/settings',  icon: '⚙️', label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-dark)', display: 'flex' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240,
        flexShrink: 0,
        padding: '28px 16px',
        borderRight: '1px solid var(--brand-border)',
        background: 'var(--brand-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20,
          padding: '4px 12px', marginBottom: 24,
        }}>
          🍽️ <span className="gradient-text">Zautomeal</span>
        </div>

        {/* Nav links */}
        {navItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 12,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.15s',
              background: active ? 'rgba(255,95,31,0.12)' : 'transparent',
              color: active ? 'var(--brand-orange)' : 'var(--brand-muted)',
              border: active ? '1px solid rgba(255,95,31,0.2)' : '1px solid transparent',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Plan badge */}
        <div style={{
          background: 'rgba(255,95,31,0.08)',
          border: '1px solid rgba(255,95,31,0.2)',
          borderRadius: 14,
          padding: '14px',
          fontSize: 12,
          color: 'var(--brand-muted)',
          lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 600, color: 'var(--brand-orange)', marginBottom: 4 }}>Free Plan</div>
          1 meal schedule • No groceries<br />
          <Link href="/dashboard/billing" style={{ color: 'var(--brand-orange)', textDecoration: 'none' }}>
            Upgrade to Starter →
          </Link>
        </div>
      </aside>

      {/* ── Page content ── */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
