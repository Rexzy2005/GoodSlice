import Link from 'next/link';
import { FruitArt } from '../components/fruit-art';
import { FeatureLink } from '../components/ui';
import { WalletPanel } from '../web3/wallet-panel';
import { InstallButton } from '../pwa/install-button';
export default function HomePage() {
  return <><section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> A LITTLE PLAY. A LITTLE GOOD.</p><h1>Swipe. Slice.<br /><span>Stack your G$.</span></h1><p>Find your rhythm. Make every slice count.<br />Welcome to your new favorite break.</p><Link href="/play" className="button">Enter the game <span aria-hidden="true">↗</span></Link><span className="hero-caption">Gameplay preview · rounds coming soon</span></div><FruitArt /><span className="art-label">FRESH CUTS. GOOD VIBES.</span></section>
    <WalletPanel /><div className="section-heading"><h2>Pick your next move</h2><span className="muted">A whole market to explore</span></div>
    <div className="feature-grid"><FeatureLink href="/tournament" title="Daily tournament" description="A new challenge. A place to put your skills to work." icon="trophy" /><FeatureLink href="/shop" title="Make it yours" description="Explore power-ups, skins and blade trails." icon="bag" tone="melon" /><FeatureLink href="/leaderboard" title="The cutting edge" description="Find your place among the sharpest slicers." icon="chart" tone="sky" /><FeatureLink href="/rewards" title="A little good adds up" description="Your eligible prizes and rewards, in one place." icon="gift" tone="leaf" /></div>
    <section className="bottom-note"><div><p className="eyebrow">TAKE SLYCE WITH YOU</p><h2>A little play, wherever you are.</h2><p className="muted">Add Slyce to your home screen for a quick way back.</p></div><InstallButton /></section>
  </>;
}
