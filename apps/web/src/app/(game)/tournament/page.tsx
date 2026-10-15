import type { Metadata } from 'next';
import { PageHeading, EmptyState, UnavailableAction } from '../../../components/ui';
export const metadata: Metadata = { title: 'Daily tournament' };
export default function TournamentPage() { return <><PageHeading eyebrow="THE DAILY CHALLENGE" title="Big slices. Bigger ambitions.">Bring your best run to the daily tournament.</PageHeading><section className="panel"><EmptyState icon="trophy" title="The next tournament is still on the board" action={<UnavailableAction>Enter tournament</UnavailableAction>}><p>No active tournament is available. Entry cost, prize pool and closing time will appear together when entries open.</p><p>No G$ payment can be made from this screen yet.</p></EmptyState></section></>; }
