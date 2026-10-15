import type { ReactNode } from 'react';
import Link from 'next/link';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from '../../components/providers';
import { MobileMenu } from '../../components/mobile-menu';
import { Navigation } from '../../components/navigation';
import { Icon } from '../../components/icon';
import { WalletControl } from '../../web3/wallet-control';
export default function GameLayout({ children }: { children: ReactNode }) {
  return <Providers><div className="arcade-shell">
    <header className="arcade-header"><Link href="/" className="brand" aria-label="Slyce home">slyce<span className="brand-dot">/</span></Link><span className="arcade-label">THE NIGHT MARKET ARCADE</span><div className="desktop-wallet"><WalletControl /></div><MobileMenu /></header>
    <div className="arcade-body"><aside className="arcade-rail"><Navigation /><Link href="/" className="back-to-site"><Icon name="arrow" /> Back to website</Link></aside>
    <main id="main" tabIndex={-1} className="arcade-main">{children}</main></div>
  </div></Providers>;
}
