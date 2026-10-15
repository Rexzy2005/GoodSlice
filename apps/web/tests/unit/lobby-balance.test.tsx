// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { WalletContext, type WalletState } from '../../src/web3/context';
import { LobbyBalance } from '../../src/web3/lobby-balance';
afterEach(cleanup);
const base: WalletState = { runtime: 'standard', status: 'connected', wrongNetwork: false, balance: { status: 'ready', formatted: '123.45' } };
it('presents the formatted wallet value without converting token units', () => {
  render(<WalletContext value={base}><LobbyBalance /></WalletContext>);
  expect(screen.getByText('123.45')).toBeTruthy();
});
for (const state of [ { ...base, status: 'disconnected' as const }, { ...base, wrongNetwork: true }, { ...base, balance: { status: 'offline' as const, formatted: '123.45' } }, { ...base, balance: { status: 'error' as const, formatted: '123.45' } } ]) it('hides stale balances when the wallet cannot establish current balance', () => {
  render(<WalletContext value={state}><LobbyBalance /></WalletContext>);
  expect(screen.queryByText('123.45')).toBeNull();
  expect(screen.getByText('Unavailable')).toBeTruthy();
});
