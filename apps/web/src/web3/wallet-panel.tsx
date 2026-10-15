'use client';
import { useWallet } from './context';
import { AccountButton } from './account-button';
import { explorerUrl } from './config';
import { publicConfig } from '../config/public';
export function WalletPanel() {
  const wallet = useWallet();
  return <section className="wallet-panel" aria-label="Wallet">
    <div><span className="eyebrow">YOUR WALLET</span><p className="balance">{wallet.balance.status === 'ready' ? wallet.balance.formatted + ' G$' : wallet.balance.status === 'loading' ? 'Loading G$…' : 'G$ balance unavailable'}</p></div>
    <AccountButton />
    {wallet.address && publicConfig.network && <a className="address" href={explorerUrl(publicConfig.network, 'address', wallet.address)} target="_blank" rel="noreferrer">{wallet.address.slice(0, 6)}…{wallet.address.slice(-4)} ↗</a>}
    {wallet.wrongNetwork && <p role="alert" className="error-text">Your wallet is on a different network. Switch to the configured Celo network before continuing.</p>}
    {wallet.balance.status === 'offline' && <p role="status">You’re offline. Reconnect to refresh your G$ balance.</p>}
    {wallet.balance.status === 'error' && <p role="status">Balance could not be loaded. No cached amount is shown.</p>}
  </section>;
}
