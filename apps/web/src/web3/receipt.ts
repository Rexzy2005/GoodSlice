import type { Hash, TransactionReceipt } from 'viem';
/** Uses the configured public client's receipt waiter, not a wallet approval result. */
export function receiptReader(client: { waitForTransactionReceipt(parameters: { hash: Hash; confirmations: number; timeout: number }): Promise<TransactionReceipt> }) {
  return (hash: Hash) => client.waitForTransactionReceipt({ hash, confirmations: 1, timeout: 120_000 });
}
