'use client';
import Link from 'next/link';
import { Icon } from '../components/icon';
import { useWallet } from './context';
export function LobbyBalance() {
  const wallet = useWallet();
  const available = wallet.status === 'connected' && !wallet.wrongNetwork && wallet.balance.status === 'ready' && wallet.balance.formatted !== undefined;
  const message = wallet.wrongNetwork ? 'Switch to the configured network to view your balance.'
    : wallet.status !== 'connected' ? 'Connect your wallet to view your G$.'
    : wallet.balance.status === 'offline' ? 'You are offline. Reconnect to view your balance.'
    : wallet.balance.status === 'loading' ? 'Reading your wallet balance…'
    : wallet.balance.status === 'error' ? 'Your balance could not be loaded.'
    : available ? 'Your connected wallet balance. Preview play does not earn G$.' : 'G$ balance is unavailable in this environment.';
  return <section className="lounge-balance" aria-labelledby="balance-title"><div className="balance-heading"><span className="balance-icon"><Icon name="wallet" /></span><h2 id="balance-title">Your balance</h2><span className="balance-currency">G$</span></div><div className="balance-value" aria-live="polite">{available ? <><strong>{wallet.balance.formatted}</strong><span>G$</span></> : <strong className="balance-empty">{wallet.balance.status === 'loading' && wallet.status === 'connected' && !wallet.wrongNetwork ? 'Loading…' : 'Unavailable'}</strong>}</div><p>{message}</p><Link href="/profile">Wallet details <Icon name="arrow" /></Link></section>;
}
