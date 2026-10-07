import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import tokens from '../design/tokens.json';
import { Providers } from '../components/providers';
import { Navigation } from '../components/navigation';
import { PwaRegistration } from '../pwa/registration';
import { publicConfig } from '../config/public';
export const metadata: Metadata = {
  title: { default: 'Slyce — Swipe. Slice. Stack your G$.', template: '%s · Slyce' },
  description: 'Your next slice starts here. Off-chain play, tournaments and GoodDollar rewards.',
  applicationName: 'Slyce', manifest: '/manifest.webmanifest',
  ...(publicConfig.appUrl ? { metadataBase: new URL(publicConfig.appUrl) } : {}),
  appleWebApp: { capable: true, title: 'Slyce', statusBarStyle: 'black-translucent' },
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: tokens.night };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Providers>
    <div className="app-shell"><aside className="sidebar"><Link href="/" className="brand" aria-label="Slyce home"><span className="brand-mark">/</span>slyce<span className="brand-dot">.</span></Link><Navigation /><div className="sidebar-note"><span className="status-dot" />Made for a good time.<br /><span className="muted">Powered by possibility.</span></div></aside>
    <div className="main-column"><header className="topbar"><span className="eyebrow">WELCOME TO THE NIGHT MARKET</span><Link href="/profile" className="profile-link">Your profile ↗</Link></header><main id="main" tabIndex={-1}>{children}</main><footer>Small slices. Good things.<span>Slyce · Foundation preview</span></footer></div></div>
    <PwaRegistration />
  </Providers></body></html>;
}
