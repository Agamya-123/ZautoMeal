import Link from 'next/link';

const mockOrders = [
  { id: 'o1', restaurant: 'Burger King',  items: 'Whopper + Fries',         amount: 349, status: 'DELIVERED',  date: 'Today',     time: '1:02 PM', scheduleLabel: 'Work Lunch' },
  { id: 'o2', restaurant: 'Subway',       items: 'Veg Delight Sub',          amount: 219, status: 'DELIVERED',  date: 'Today',     time: '8:35 AM', scheduleLabel: 'Daily Breakfast' },
  { id: 'o3', restaurant: 'Burger King',  items: 'Whopper',                  amount: 249, status: 'DELIVERED',  date: 'Yesterday', time: '1:00 PM', scheduleLabel: 'Work Lunch' },
  { id: 'o4', restaurant: 'Pizza Hut',    items: 'Margherita + Garlic Bread', amount: 599, status: 'DELIVERED',  date: 'Mon, May 6',time: '7:30 PM', scheduleLabel: 'Weekend Dinner' },
  { id: 'o5', restaurant: 'Burger King',  items: 'Whopper + Fries',          amount: 349, status: 'SKIPPED',    date: 'Sun, May 5',time: '1:00 PM', scheduleLabel: 'Work Lunch' },
];

const statusColors: Record<string, string> = {
  DELIVERED: 'success', IN_TRANSIT: 'warn', PLACED: 'orange', FAILED: 'danger', SKIPPED: 'warn',
};

export default function HistoryPage() {
  const total = mockOrders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.amount, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-dark)', padding: '40px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <Link href="/dashboard" style={{ color: 'var(--brand-muted)', textDecoration: 'none', fontSize: 14 }}>← Dashboard</Link>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 26 }}>Order History</h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Orders', value: `${mockOrders.filter(o => o.status === 'DELIVERED').length}` },
            { label: 'Total Spent',  value: `₹${total}` },
            { label: 'Skipped',      value: `${mockOrders.filter(o => o.status === 'SKIPPED').length}` },
          ].map((s, i) => (
            <div key={i} className="glass" style={{ padding: '20px', borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 26 }}>{s.value}</div>
              <div style={{ color: 'var(--brand-muted)', fontSize: 12, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mockOrders.map(o => (
            <div key={o.id} className="glass" style={{
              borderRadius: 16, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'rgba(255,95,31,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>🛵</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{o.restaurant}</div>
                <div style={{ color: 'var(--brand-muted)', fontSize: 12, marginTop: 2 }}>{o.items}</div>
                <div style={{ color: 'var(--brand-muted)', fontSize: 11, marginTop: 4 }}>
                  📅 {o.scheduleLabel} • {o.date} at {o.time}
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                {o.status !== 'SKIPPED' ? `₹${o.amount}` : '—'}
              </div>
              <span className={`badge badge-${statusColors[o.status]}`}>
                {o.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
