import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zautomeal — Automate Your Hunger',
  description: 'Set your meal schedule once. Zautomeal places your Swiggy orders automatically, sends you a 1-hour heads-up, and lets you skip or reschedule with one tap.',
  keywords: ['food automation', 'swiggy', 'meal scheduling', 'auto order', 'food delivery'],
  openGraph: {
    title: 'Zautomeal',
    description: 'Automate your Swiggy orders on a schedule.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
