'use client';
import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3Provider } from '../web3/provider';
import { ApiError } from '../api/errors';
export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 0, refetchOnWindowFocus: true, retry: (count, error) => !(error instanceof ApiError && ['unavailable', 'invalid-response'].includes(error.kind)) && count < 1 } } }));
  return <QueryClientProvider client={client}><Web3Provider>{children}</Web3Provider></QueryClientProvider>;
}
