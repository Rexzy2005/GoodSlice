import type { TransactionState } from '../web3/transactions';
const labels: Record<TransactionState['status'], string> = {
  idle: 'Ready', preparing: 'Checking transaction', awaiting_wallet: 'Review the request in your wallet',
  submitted: 'Transaction submitted', confirming: 'Waiting for blockchain confirmation', confirmed: 'Confirmed on-chain',
  synchronizing: 'Confirmed. Waiting for your account to update', success: 'Confirmed and synchronized', rejected: 'Request declined', failed: 'Transaction needs attention',
};
export function TransactionStatus({ state }: { state: TransactionState }) {
  return <div role={state.status === 'failed' ? 'alert' : 'status'} aria-live="polite" className={'status-card ' + (state.status === 'failed' ? 'error-text' : '')}>
    <strong>{labels[state.status]}</strong>{'message' in state && <p>{state.message}</p>}
    {state.status === 'failed' && <p>Reason: {state.kind.replaceAll('-', ' ')}</p>}
  </div>;
}
