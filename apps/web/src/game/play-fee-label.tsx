'use client';
import { useReadContract } from 'wagmi';
import { publicConfig } from '../config/public';
import { arcadeAbi } from '../web3/abis';
import { chainFor, contractsFor, gdDecimals } from '../web3/config';
import { useWallet } from '../web3/context';
import { formatTokenAmount } from '../web3/units';
export function PlayFeeLabel() {
  const wallet = useWallet();
  return wallet.status === 'unavailable' ? null : <Fee />;
}
function Fee() {
  const arcade = contractsFor(publicConfig).arcade;
  const chain = publicConfig.network ? chainFor(publicConfig.network) : undefined;
  const fee = useReadContract({ address: arcade, abi: arcadeAbi, functionName: 'playFee', chainId: chain?.id, query: { enabled: !!arcade && !!chain } });
  if (!arcade || fee.data === undefined) return null;
  return <small className="home-fee">{fee.data === 0n ? 'Rounds are free right now' : formatTokenAmount(fee.data, gdDecimals) + ' G$ per round'}</small>;
}
