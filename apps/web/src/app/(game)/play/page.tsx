import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Icon, type IconName } from '../../../components/icon';
import { LobbyBalance } from '../../../web3/lobby-balance';
export const metadata: Metadata = { title: 'Game lobby' };
const destinations: { href: string; icon: IconName; title: string; description: string }[] = [
  { href: '/tournament', icon: 'trophy', title: 'Compete', description: 'Tournaments & verified scores' },
  { href: '/shop', icon: 'bag', title: 'Make it yours', description: 'Explore the shop' },
  { href: '/rewards', icon: 'gift', title: 'The good stuff', description: 'Rewards & activity' },
];
export default function PlayPage() {
  return <div className="lounge"><header className="lounge-heading"><div><p className="eyebrow">THE NIGHT MARKET / LOBBY</p><h1>A fresh start.<br className="mobile-only" /> A clean cut.</h1></div><span className="lounge-tag"><Icon name="scissors" /> Free slicing preview</span></header>
    <div className="lounge-grid"><section className="lounge-play" aria-labelledby="play-title"><div className="lounge-play-top"><span>01 / THE CUTTING BOARD</span><Icon name="scissors" /></div><Image className="lounge-fruit" src="/game/fruit-splash-v1.webp" alt="" width={1672} height={941} priority unoptimized /><div className="lounge-play-copy"><p className="eyebrow">YOUR NEXT FIVE MINUTES</p><h2 id="play-title">Less thinking.<br /><span>More slicing.</span></h2><p>Flying fruit. Fresh splashes. Find your rhythm with every swipe.</p><Link className="button" href="/play/arena"><Icon name="play" /> Open the board <Icon name="arrow" /></Link><small>No wallet needed. No score recorded.</small></div><div className="lounge-specs"><span><b>07</b> Fruits</span><span><b>03</b> Difficulties</span><span><Icon name="sound" /> Sound on your terms</span></div></section>
    <aside className="lounge-side"><LobbyBalance /><section className="lounge-guide"><span className="eyebrow">GET INTO THE FLOW</span><h2>One swipe is all it takes.</h2><ol><li><span>01</span><p>Open the board and start slicing.</p></li><li><span>02</span><p>Swipe on your phone or drag with a mouse.</p></li><li><span>03</span><p>Pause to change difficulty, sound or fruits.</p></li></ol></section></aside></div>
    <section className="lounge-discover" aria-labelledby="discover-title"><div className="lounge-section-title"><h2 id="discover-title">Beyond the board</h2><span>Still growing. Stay curious.</span></div><div className="lounge-links">{destinations.map(item => <Link href={item.href} key={item.href}><span className="lounge-link-icon"><Icon name={item.icon} /></span><div><small>COMING LATER</small><h3>{item.title}</h3><p>{item.description}</p></div><Icon name="arrow" /></Link>)}</div></section>
  </div>;
}
