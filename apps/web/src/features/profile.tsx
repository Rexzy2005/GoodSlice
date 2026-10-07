'use client';
import { useWallet } from '../web3/context';
import { WalletPanel } from '../web3/wallet-panel';
import { authenticationFor } from '../auth/strategy';
import { EmptyState } from '../components/ui';
export function Profile() {
  const wallet = useWallet();
  return <><WalletPanel /><section className="panel"><EmptyState title="Your corner of the market"><p>{wallet.runtime === 'detecting' ? 'Checking wallet availability…' : authenticationFor(wallet.runtime).availability.reason}</p><p>Inventory, cosmetics and account activity will appear after secure sign-in is available.</p></EmptyState></section></>;
}
