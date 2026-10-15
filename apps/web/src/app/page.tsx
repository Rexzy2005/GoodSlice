import { redirect } from 'next/navigation';
/** Slyce opens straight into the app; there is no marketing landing page. */
export default function Home() { redirect('/play'); }
