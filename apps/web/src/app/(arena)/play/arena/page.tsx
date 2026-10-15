import type { Metadata } from 'next';
import { GameHost } from '../../../../game/game-host';
export const metadata: Metadata = { title: 'The cutting floor' };
export default function ArenaPage() {
  return <div className="reference-playground"><h1 className="sr-only">The cutting floor</h1><GameHost /></div>;
}
