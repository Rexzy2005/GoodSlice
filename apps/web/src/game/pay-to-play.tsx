'use client';
import { useReadContract } from 'wagmi';
import { publicConfig } from '../config/public';
import { arcadeAbi } from '../web3/abis';
import { chainFor, contractsFor, gdDecimals } from '../web3/config';
import { TokenSpend } from '../web3/token-spend';
import { formatTokenAmount } from '../web3/units';
/** Approvals cover this many rounds so players are not asked to approve before every round. */
export const roundsPerApproval = 10n;
/** Charges the on-chain play fee; `onPaid` runs only after SlyceArcade.play confirms. */
export function PayToPlay({ onPaid }: { onPaid: () => void }) {
  const arcade = contractsFor(publicConfig).arcade;
  const chain = publicConfig.network ? chainFor(publicConfig.network) : undefined;
  const fee = useReadContract({ address: arcade, abi: arcadeAbi, functionName: 'playFee', chainId: chain?.id, query: { enabled: !!arcade && !!chain } });
  if (!arcade) return <p className="error-text" role="alert">Paid play is not configured for this environment.</p>;
  if (fee.isPending) return <p role="status">Checking the play fee…</p>;
  if (fee.isError || fee.data === undefined) return <p className="error-text" role="alert">The play fee could not be read. <button className="text-button" onClick={() => void fee.refetch()}>Try again</button></p>;
  const amount = fee.data;
  return <div className="pay-to-play"><p className="eyebrow">ROUND ENTRY</p>
    <p className="pay-fee">{amount === 0n ? 'Free right now' : formatTokenAmount(amount, gdDecimals) + ' G$ per round'}</p>
    <TokenSpend spender={arcade} amount={amount} approveAmount={amount * roundsPerApproval}
      label={amount === 0n ? 'Start round' : 'Pay ' + formatTokenAmount(amount, gdDecimals) + ' G$ & play'}
      call={{ address: arcade, abi: arcadeAbi, functionName: 'play', args: [amount] }}
      onConfirmed={async () => { onPaid(); }} />
    <small className="muted">Fees go to the Slyce treasury on Celo. Your approval covers {roundsPerApproval.toString()} rounds; you confirm each round.</small></div>;
}
