'use client';
import { useState } from 'react';
import { useLeaderboard } from '../api/queries';
import type { LeaderboardScope } from '../api/contracts';
import { EmptyState } from '../components/ui';
const scopes: { value: LeaderboardScope; label: string }[] = [{ value: 'today', label: 'Today' }, { value: 'week', label: 'This week' }, { value: 'all', label: 'All time' }];
export function Leaderboard() {
  const [scope, setScope] = useState<LeaderboardScope>('today');
  const query = useLeaderboard(scope);
  return <section className="panel"><div className="segmented" aria-label="Leaderboard period">{scopes.map(item => <button key={item.value} aria-pressed={scope === item.value} onClick={() => setScope(item.value)}>{item.label}</button>)}</div>
    {query.isPending ? <p className="loading-state" role="status">Loading verified scores…</p> : query.isError ? <EmptyState title="The leaderboard is unavailable"><p>{query.error.message}</p><button className="text-button" onClick={() => void query.refetch()}>Try again</button></EmptyState> : query.data.length === 0 ? <EmptyState title="A fresh board"><p>No verified scores for this period yet.</p></EmptyState> : <ol className="data-list">{query.data.map(entry => <li key={entry.playerId}><span>#{entry.rank} {entry.displayName}</span><strong>{entry.score.toLocaleString()}</strong></li>)}</ol>}
  </section>;
}
