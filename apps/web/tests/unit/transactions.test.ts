import { describe, expect, it, vi } from 'vitest';
import type { Hash, TransactionReceipt } from 'viem';
import { createTransactionController, transitionTransaction, type TransactionOperations, type TransactionState } from '../../src/web3/transactions';
const hash: Hash = '0x' + '1'.repeat(64) as Hash;
const receipt: TransactionReceipt = { transactionHash: hash, transactionIndex: 0, blockHash: hash, blockNumber: 1n,
  from: '0x0000000000000000000000000000000000000001', to: '0x0000000000000000000000000000000000000002',
  contractAddress: null, cumulativeGasUsed: 1n, effectiveGasPrice: 1n, gasUsed: 1n, logs: [], logsBloom: '0x', status: 'success', type: 'eip1559' };
const operations = (): TransactionOperations => ({ prepare: async () => {}, submit: async () => hash, receipt: async () => receipt, synchronized: async () => false });
describe('transaction authority', () => {
  it('cannot jump from a wallet prompt to success', () => { expect(() => transitionTransaction({ status: 'awaiting_wallet' }, { status: 'success', hash, receipt })).toThrow(); });
  it('keeps confirmed and synchronized separate without resubmitting payment', async () => {
    const states: TransactionState[] = []; const controller = createTransactionController(state => states.push(state));
    const ops = operations(); ops.submit = vi.fn(ops.submit); await controller.run(ops);
    expect(controller.getState().status).toBe('synchronizing'); expect(states.map(state => state.status)).not.toContain('success');
    ops.synchronized = async () => true; await controller.retrySynchronization(ops);
    expect(controller.getState().status).toBe('success'); expect(ops.submit).toHaveBeenCalledTimes(1);
  });
  it('does not confirm a reverted receipt', async () => {
    const controller = createTransactionController(() => {}); const ops = operations(); ops.receipt = async () => ({ ...receipt, status: 'reverted' });
    await controller.run(ops); expect(controller.getState()).toMatchObject({ status: 'failed', kind: 'reverted', hash });
  });
  it('distinguishes wallet rejection from RPC failure', async () => {
    const controller = createTransactionController(() => {}); const ops = operations(); ops.submit = async () => { throw { code: 4001 }; };
    await controller.run(ops); expect(controller.getState().status).toBe('rejected');
  });
  it('retains successful receipt after indexer failure', async () => {
    const controller = createTransactionController(() => {}); const ops = operations(); ops.synchronized = async () => { throw new Error('offline'); };
    await controller.run(ops); expect(controller.getState()).toMatchObject({ status: 'failed', kind: 'synchronization', receipt });
    ops.synchronized = async () => true; await controller.retrySynchronization(ops); expect(controller.getState().status).toBe('success');
  });
});
