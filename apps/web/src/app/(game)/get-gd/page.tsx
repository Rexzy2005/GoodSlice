import type { Metadata } from 'next';
import { PageHeading } from '../../../components/ui';
import { ClaimPanel } from '../../../gooddollar/claim-panel';
import { WalletPanel } from '../../../web3/wallet-panel';
export const metadata: Metadata = { title: 'Get G$' };
export default function GetGdPage() { return <><PageHeading eyebrow="A CURRENCY FOR GOOD" title="Claim your daily G$.">GoodDollar gives free G$ to verified people every day. Spend it in the market and tournaments.</PageHeading><WalletPanel /><ClaimPanel /></>; }
