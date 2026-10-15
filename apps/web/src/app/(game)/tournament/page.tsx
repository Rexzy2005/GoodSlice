import type { Metadata } from 'next';
import { PageHeading } from '../../../components/ui';
import { Tournament } from '../../../features/tournament';
export const metadata: Metadata = { title: 'Daily tournament' };
export default function TournamentPage() { return <><PageHeading eyebrow="THE DAILY CHALLENGE" title="Big slices. Bigger ambitions.">Enter with G$, post your best run and compete for the prize pool.</PageHeading><Tournament /></>; }
