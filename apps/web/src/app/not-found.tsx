import Link from 'next/link';
import { EmptyState } from '../components/ui';
export default function NotFound() { return <EmptyState title="This slice is missing" action={<Link className="button" href="/">Back to the market</Link>}><p>That page could not be found.</p></EmptyState>; }
