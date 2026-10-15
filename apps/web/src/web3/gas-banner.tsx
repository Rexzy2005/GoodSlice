'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from './context';
/** New email wallets start with no CELO; GoodDollar's faucet tops up verified users. */
export function GasBanner() {
  const wallet = useWallet();
  const pathname = usePathname();
  if (wallet.status !== 'connected' || wallet.gas !== 'low' || pathname === '/get-gd') return null;
  return <Link href="/get-gd" className="gas-banner" role="status"><strong>You need a little CELO for network fees.</strong> Verify with GoodDollar and claim your daily G$; GoodDollar tops up gas for free. →</Link>;
}
