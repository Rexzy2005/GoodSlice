import type { Metadata } from 'next';
import { ArenaSession } from '../../../../game/arena-session';
export const metadata: Metadata = { title: 'The cutting floor' };
export default function ArenaPage() {
  return <div className="reference-playground"><h1 className="sr-only">The cutting floor</h1><ArenaSession /></div>;
}
