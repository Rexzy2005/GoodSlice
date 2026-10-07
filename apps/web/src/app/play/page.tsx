import type { Metadata } from 'next';
import { PageHeading } from '../../components/ui';
import { GameHost } from '../../game/game-host';
export const metadata: Metadata = { title: 'Play' };
export default function PlayPage() { return <><PageHeading eyebrow="FIND YOUR FLOW" title="Ready for a fresh cut?">Gameplay stays off-chain. Verified rounds will appear here when play opens.</PageHeading><GameHost /></>; }
