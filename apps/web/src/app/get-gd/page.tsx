import type { Metadata } from 'next';
import { PageHeading, EmptyState, UnavailableAction } from '../../components/ui';
import { goodDollar } from '../../gooddollar/service';
import { WalletPanel } from '../../web3/wallet-panel';
export const metadata: Metadata = { title: 'Get G$' };
export default function GetGdPage() { return <><PageHeading eyebrow="A CURRENCY FOR GOOD" title="Get to know G$.">GoodDollar connects the Slyce market, tournaments and rewards.</PageHeading><WalletPanel /><section className="panel"><EmptyState title="Daily claims are not available yet" action={<UnavailableAction>Claim daily G$</UnavailableAction>}><p>{goodDollar.availability.reason}</p><p>Your identity and claim eligibility have not been checked.</p></EmptyState></section></>; }
