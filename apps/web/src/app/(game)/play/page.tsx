import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon, type IconName } from '../../../components/icon';
import { PlayFeeLabel } from '../../../game/play-fee-label';
export const metadata: Metadata = { title: 'Play' };
const tiles: { href: string; icon: IconName; title: string; detail: string; tone: string }[] = [
  { href: '/get-gd', icon: 'leaf', title: 'Daily G$', detail: 'Claim free G$', tone: 'leaf' },
  { href: '/tournament', icon: 'trophy', title: 'Tournament', detail: 'Win the pool', tone: 'mango' },
  { href: '/rewards', icon: 'gift', title: 'Rewards', detail: 'Claim prizes', tone: 'melon' },
  { href: '/shop', icon: 'bag', title: 'Blades', detail: 'Style your slash', tone: 'sky' },
];
export default function PlayPage() {
  return <div className="home">
    <section className="home-hero" aria-labelledby="home-title">
      <Image className="home-hero-art" src="/game/fruit-splash-v1.webp" alt="" width={1672} height={941} priority unoptimized />
      <p className="eyebrow">READY WHEN YOU ARE</p>
      <h1 id="home-title">Slice fruit.<br /><span>Dodge bombs.</span></h1>
      <p className="muted">Chain combos for bonus points. Miss three fruit and the round ends.</p>
      <Link className="button home-play" href="/play/arena"><Icon name="play" /> Play now</Link>
      <PlayFeeLabel />
    </section>
    <nav className="home-tiles" aria-label="Quick actions">{tiles.map(tile => <Link key={tile.href} href={tile.href} className={'home-tile tone-' + tile.tone}><Icon name={tile.icon} /><strong>{tile.title}</strong><small>{tile.detail}</small></Link>)}</nav>
  </div>;
}
