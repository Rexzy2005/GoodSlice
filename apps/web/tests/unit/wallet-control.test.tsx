// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { WalletContext, type WalletState } from '../../src/web3/context';
import { WalletControl } from '../../src/web3/wallet-control';
vi.mock('next/dynamic', () => ({ default: () => () => <button>Configured wallet picker</button> }));
afterEach(cleanup);
const base: WalletState = { runtime: 'standard', status: 'unavailable', wrongNetwork: false, balance: { status: 'unavailable' }, message: 'Wallet configuration is missing.' };
it('explains unavailable configuration without pretending to connect', () => {
  render(<WalletContext value={base}><WalletControl /></WalletContext>);
  fireEvent.click(screen.getByRole('button', { name: 'Connect wallet' }));
  expect(screen.getByRole('status').textContent).toBe(base.message);
  expect(screen.queryByRole('button', { name: 'Configured wallet picker' })).toBeNull();
});
it('uses the configured standard wallet picker', () => {
  render(<WalletContext value={{ ...base, status: 'disconnected' }}><WalletControl /></WalletContext>);
  expect(screen.getByRole('button', { name: 'Configured wallet picker' })).toBeTruthy();
});
it('never renders the standard wallet button inside MiniPay', () => {
  const retry = vi.fn();
  render(<WalletContext value={{ ...base, runtime: 'minipay', status: 'error', retry }}><WalletControl /></WalletContext>);
  expect(screen.queryByRole('button', { name: /connect wallet/i })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Configured wallet picker' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Retry connection' }));
  expect(retry).toHaveBeenCalledOnce();
});
