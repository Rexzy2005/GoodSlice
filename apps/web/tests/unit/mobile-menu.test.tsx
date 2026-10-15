// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { WalletContext, type WalletState } from '../../src/web3/context';
import { MobileMenu } from '../../src/components/mobile-menu';
vi.mock('next/navigation', () => ({ usePathname: () => '/play' }));
vi.mock('next/dynamic', () => ({ default: () => () => <button>Open wallet picker</button> }));
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it('opens navigation, locks page scrolling and restores it when closed', () => {
  document.body.style.overflow = 'auto';
  render(<MobileMenu />);
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
  expect(screen.getByRole('dialog')).toBeTruthy();
  expect(document.body.style.overflow).toBe('hidden');
  expect(screen.getByRole('link', { name: 'Play' }).getAttribute('aria-current')).toBe('page');
  fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.body.style.overflow).toBe('auto');
});
it('closes the drawer when a destination is chosen', () => {
  render(<MobileMenu />);
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
  fireEvent.click(screen.getByRole('link', { name: 'Play' }));
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('releases the drawer before opening the standard wallet portal', () => {
  const wallet: WalletState = { runtime: 'standard', status: 'disconnected', wrongNetwork: false, balance: { status: 'unavailable' } };
  render(<WalletContext value={wallet}><MobileMenu /></WalletContext>);
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
  expect(screen.getByRole('region', { name: 'Wallet connection' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Open wallet picker' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.body.style.overflow).not.toBe('hidden');
});
