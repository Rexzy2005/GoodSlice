import type { Metadata } from 'next';
import { PageHeading, EmptyState, UnavailableAction } from '../../../components/ui';
export const metadata: Metadata = { title: 'Rewards' };
export default function RewardsPage() { return <><PageHeading eyebrow="GOOD THINGS ADD UP" title="Your rewards.">Tournament prizes and eligible streak rewards belong here.</PageHeading><section className="panel"><EmptyState icon="gift" title="Nothing to claim just yet" action={<UnavailableAction>Claim rewards</UnavailableAction>}><p>Reward eligibility is unavailable until secure sign-in and the rewards service are connected. This is not a zero balance.</p></EmptyState></section></>; }
