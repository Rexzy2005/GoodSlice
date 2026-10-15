'use client';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import type { Abi, Address, ContractFunctionArgs, ContractFunctionName } from 'viem';
import { publicConfig } from '../config/public';
import { chainFor } from './config';
import { receiptReader } from './receipt';
import { TransactionFailure } from './transactions';
import { useTransaction } from './use-transaction';
export interface WriteCall<abi extends Abi, name extends ContractFunctionName<abi, 'nonpayable'>> {
  address: Address; abi: abi; functionName: name; args: ContractFunctionArgs<abi, 'nonpayable', name>;
}
/** Simulates, submits and confirms one contract call through the shared transaction lifecycle. */
export function useContractWrite() {
  const tx = useTransaction();
  const chain = publicConfig.network ? chainFor(publicConfig.network) : undefined;
  const account = useAccount();
  const publicClient = usePublicClient(chain ? { chainId: chain.id } : {});
  const { data: walletClient } = useWalletClient(chain ? { chainId: chain.id } : {});
  async function execute<abi extends Abi, name extends ContractFunctionName<abi, 'nonpayable'>>(
    call: WriteCall<abi, name>,
    options: { check?: () => void; onConfirmed: () => Promise<unknown> },
  ) {
    try { tx.reset(); } catch { /* Already idle, or a transaction is still running. */ }
    let request: Parameters<NonNullable<typeof walletClient>['writeContract']>[0] | undefined;
    await tx.run({
      async prepare() {
        if (!chain || !publicClient) throw new TransactionFailure('rpc', 'Network configuration is unavailable.');
        if (!account.address || !walletClient) throw new TransactionFailure('unknown', 'Connect your wallet first.');
        if (account.chainId !== chain.id) throw new TransactionFailure('wrong-network', 'Switch your wallet to ' + chain.name + '.');
        options.check?.();
        const simulation = await publicClient.simulateContract({ ...call, account: account.address, chain } as Parameters<typeof publicClient.simulateContract>[0]);
        request = simulation.request as typeof request;
      },
      submit() { if (!walletClient || !request) throw new TransactionFailure('unknown', 'Wallet is unavailable.'); return walletClient.writeContract(request); },
      receipt: hash => { if (!publicClient) throw new TransactionFailure('rpc', 'Network unavailable.'); return receiptReader(publicClient)(hash); },
      async synchronized() { await options.onConfirmed(); return true; },
    });
  }
  return { ...tx, execute, ready: !!chain && !!account.address && !!walletClient && account.chainId === chain.id };
}
