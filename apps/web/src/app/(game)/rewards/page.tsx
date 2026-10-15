import type { Metadata } from 'next';
import { PageHeading } from '../../../components/ui';
import { Rewards } from '../../../features/rewards';
export const metadata: Metadata = { title: 'Rewards' };
export default function RewardsPage() { return <><PageHeading eyebrow="GOOD THINGS ADD UP" title="Your rewards.">Claim the G$ prizes you've won in tournaments.</PageHeading><Rewards /></>; }
