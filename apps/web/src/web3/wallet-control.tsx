'use client';
import dynamic from 'next/dynamic';
import { useId, useState } from 'react';
import { useWallet } from './context';
import { Icon } from '../components/icon';
const StandardButton = dynamic(() => import('./standard-button'), { ssr: false });
export function WalletControl() {
  const availabilityId = useId();
  const wallet = useWallet();
  const [showDetails, setShowDetails] = useState(false);
  if (wallet.runtime === 'minipay') return <div className="wallet-control"><span className="wallet-runtime"><Icon name="wallet" />{wallet.status === 'connected' ? 'MiniPay connected' : wallet.message ?? 'Connecting to MiniPay…'}</span>{wallet.status === 'error' && <button className="text-button" onClick={wallet.retry}>Retry connection</button>}</div>;
  if (wallet.runtime === 'standard' && wallet.status !== 'unavailable') return <div className="wallet-control"><StandardButton /></div>;
  return <div className="wallet-control"><button className="button wallet-trigger" onClick={() => setShowDetails(value => !value)} aria-expanded={showDetails} aria-controls={availabilityId} disabled={wallet.runtime === 'detecting'}><Icon name="wallet" />{wallet.runtime === 'detecting' ? 'Checking wallet…' : 'Connect wallet'}</button>{showDetails && <p id={availabilityId} className="wallet-popover" role="status">{wallet.message ?? 'Wallet connection is not configured for this environment.'}</p>}</div>;
}
