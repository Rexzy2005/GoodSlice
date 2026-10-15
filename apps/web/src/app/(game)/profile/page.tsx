import type { Metadata } from 'next';
import { PageHeading } from '../../../components/ui';
import { Profile } from '../../../features/profile';
export const metadata: Metadata = { title: 'Profile' };
export default function ProfilePage() { return <><PageHeading eyebrow="YOUR CORNER" title="Looking sharp.">Your wallet, collection and activity.</PageHeading><Profile /></>; }
