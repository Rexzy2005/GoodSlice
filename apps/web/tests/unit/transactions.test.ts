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

it('recovers confirmation after an RPC failure without preparing or submitting again', async () => {
  const controller = createTransactionController(() => {});
  const ops = operations();
  ops.prepare = vi.fn(ops.prepare);
  ops.submit = vi.fn(ops.submit);
  ops.receipt = vi.fn<TransactionOperations['receipt']>()
    .mockRejectedValueOnce(new Error('connection lost'))
    .mockResolvedValueOnce(receipt);
  await controller.run(ops);
  expect(controller.getState()).toMatchObject({ status: 'failed', hash });
  await controller.retryConfirmation(ops);
  expect(controller.getState()).toMatchObject({ status: 'synchronizing', hash, receipt });
  expect(ops.prepare).toHaveBeenCalledTimes(1);
  expect(ops.submit).toHaveBeenCalledTimes(1);
  expect(ops.receipt).toHaveBeenCalledTimes(2);
});

it('does not treat a reverted replacement receipt as proof the original payment reverted', async () => {
  const controller = createTransactionController(() => {});
  const ops = operations();
  ops.receipt = async () => ({ ...receipt, transactionHash: '0x2222', status: 'reverted' });
  await controller.run(ops);
  expect(controller.getState()).toMatchObject({ status: 'failed', kind: 'rpc', hash });
});

it('does not retry confirmation for a known revert', async () => {
  const controller = createTransactionController(() => {});
  const ops = operations();
  ops.receipt = async () => ({ ...receipt, status: 'reverted' });
  await controller.run(ops);
  await expect(controller.retryConfirmation(ops)).rejects.toThrow('No unconfirmed transaction');
});

it('prevents a duplicate submission while wallet approval is pending', async () => {
  const controller = createTransactionController(() => {});
  let approve!: (value: Hash) => void;
  const ops = operations();
  ops.submit = vi.fn(() => new Promise<Hash>(resolve => { approve = resolve; }));
  const pending = controller.run(ops);
  await Promise.resolve();
  await expect(controller.run(ops)).rejects.toThrow('already active');
  approve(hash);
  await pending;
  expect(ops.submit).toHaveBeenCalledTimes(1);
});
