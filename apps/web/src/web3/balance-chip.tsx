'use client';
import Link from 'next/link';
import { useWallet } from './context';
export function BalanceChip() {
  const wallet = useWallet();
  const text = wallet.balance.status === 'ready' && wallet.balance.formatted !== undefined
    ? Number(wallet.balance.formatted).toLocaleString(undefined, { maximumFractionDigits: 2 }) : wallet.balance.status === 'loading' ? '…' : '—';
  return <Link href="/get-gd" className="balance-chip" aria-label={'G$ balance: ' + text}><b>G$</b>{text}</Link>;
}
