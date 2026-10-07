import { formatUnits, parseUnits } from 'viem';
function validateDecimals(decimals: number) { if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) throw new Error('Invalid token decimals'); }
export function formatTokenAmount(amount: bigint, decimals: number): string { validateDecimals(decimals); return formatUnits(amount, decimals); }
export function parseTokenAmount(value: string, decimals: number): bigint {
  validateDecimals(decimals);
  if (!/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value)) throw new Error('Enter a non-negative decimal amount');
  if ((value.split('.')[1]?.length ?? 0) > decimals) throw new Error('Amount exceeds token precision');
  return parseUnits(value, decimals);
}
