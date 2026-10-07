'use client';
import dynamic from 'next/dynamic';
import { useWallet } from './context';
import { explorerUrl } from './config';
import { publicConfig } from '../config/public';
const StandardButton = dynamic(() => import('./standard-button'), { ssr: false });
export function WalletPanel() {
  const wallet = useWallet();
  return <section className="wallet-panel" aria-label="Wallet">
    <div><span className="eyebrow">YOUR WALLET</span><p className="balance">{wallet.balance.status === 'ready' ? wallet.balance.formatted + ' G$' : wallet.balance.status === 'loading' ? 'Loading G$…' : 'G$ balance unavailable'}</p></div>
    {wallet.runtime === 'standard' && wallet.status !== 'unavailable' ? <StandardButton /> : <p className="muted" role="status">{wallet.message ?? (wallet.status === 'connected' ? 'MiniPay connected' : wallet.status === 'connecting' ? 'Connecting to MiniPay…' : 'MiniPay connection unavailable')}</p>}
    {wallet.address && publicConfig.network && <a className="address" href={explorerUrl(publicConfig.network, 'address', wallet.address)} target="_blank" rel="noreferrer">{wallet.address.slice(0, 6)}…{wallet.address.slice(-4)} ↗</a>}
    {wallet.wrongNetwork && <p role="alert" className="error-text">Your wallet is on a different network. Switch to the configured Celo network before continuing.</p>}
    {wallet.balance.status === 'offline' && <p role="status">You’re offline. Reconnect to refresh your G$ balance.</p>}
    {wallet.balance.status === 'error' && <p role="status">Balance could not be loaded. No cached amount is shown.</p>}
    {wallet.runtime === 'minipay' && wallet.status === 'error' && <button className="button secondary" onClick={wallet.retry}>Retry connection</button>}
  </section>;
}
