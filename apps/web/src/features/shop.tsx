'use client';
import { useShop } from '../api/queries';
import { EmptyState } from '../components/ui';
export function Shop() {
  const query = useShop();
  return <section className="panel">{query.isPending ? <p className="loading-state" role="status">Loading shop items…</p> : query.isError ? <EmptyState title="The market is getting ready"><p>Power-ups and cosmetics will appear here when the shop is connected. Prices and ownership are unavailable.</p><button className="text-button" onClick={() => void query.refetch()}>Check again</button></EmptyState> : query.data.length === 0 ? <EmptyState title="No items available"><p>Check back when the next collection arrives.</p></EmptyState> : <ul className="data-list">{query.data.map(item => <li key={item.id}><span>{item.name}<small>{item.category}</small></span><button className="button secondary" disabled>Purchases unavailable</button></li>)}</ul>}</section>;
}
