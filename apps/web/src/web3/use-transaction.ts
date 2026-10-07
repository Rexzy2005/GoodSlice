'use client';
import { useEffect, useRef, useState } from 'react';
import { createTransactionController, type TransactionState } from './transactions';
/** One controller per mounted action. Unmounting does not cancel a submitted transaction. */
export function useTransaction() {
  const alive = useRef(true);
  const [state, setState] = useState<TransactionState>({ status: 'idle' });
  const [controller] = useState(() => createTransactionController(next => { if (alive.current) setState(next); }));
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  return { state, run: controller.run, reset: controller.reset, retryConfirmation: controller.retryConfirmation, retrySynchronization: controller.retrySynchronization };
}
