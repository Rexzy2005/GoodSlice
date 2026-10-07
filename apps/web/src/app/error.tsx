'use client';
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="empty-state" role="alert"><h1>Something interrupted your visit.</h1><p>Try loading this page again. If you submitted a payment, check its status in your wallet before retrying.</p><button className="button" onClick={reset}>Try again</button></section>;
}
