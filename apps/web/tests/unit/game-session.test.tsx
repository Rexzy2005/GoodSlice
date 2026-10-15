// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { GameBridge, GameCommand } from '../../src/game/bridge';
import { GameHost } from '../../src/game/game-host';
const observed = vi.hoisted(() => {
  const state: { bridge: GameBridge | undefined; commands: GameCommand[] } = { bridge: undefined, commands: [] };
  return state;
});
vi.mock('../../src/game/host-lifecycle', () => ({ attachGameHost: (_parent: HTMLElement, bridge: GameBridge) => {
  observed.bridge = bridge;
  const unsubscribe = bridge.onCommand(command => observed.commands.push(command));
  bridge.emit({ type: 'ready' });
  observed.commands.length = 0; // Ignore initial configuration in interaction assertions.
  return { ready: Promise.resolve(), dispose: unsubscribe };
} }));
afterEach(() => { cleanup(); observed.commands.length = 0; observed.bridge = undefined; vi.restoreAllMocks(); });
it('does not invent readings and uses bridge commands to pause and resume', () => {
  render(<GameHost />);
  expect(screen.queryByRole('button', { name: 'Start round' })).toBeNull();
  expect(screen.getAllByText('Not started')).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', { name: 'Pause canvas' }));
  expect(observed.commands).toEqual([{ type: 'pause' }]);
  expect(screen.getByRole('heading', { name: 'Your board is paused.' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Resume canvas', pressed: true }));
  expect(observed.commands).toEqual([{ type: 'pause' }, { type: 'resume' }]);
  act(() => { observed.bridge?.emit({ type: 'score-changed', score: 125 }); observed.bridge?.emit({ type: 'lives-changed', lives: 2 }); });
  expect(screen.getByText('125')).toBeTruthy();
  expect(screen.getByText('2')).toBeTruthy();
});
it('handles fullscreen refusal without breaking the session', async () => {
  const original = Object.getOwnPropertyDescriptor(document, 'fullscreenEnabled');
  Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true });
  const request = vi.fn().mockRejectedValue(new Error('Unavailable'));
  render(<GameHost />);
  Object.defineProperty(screen.getByRole('region', { name: 'Slyce game session' }), 'requestFullscreen', { configurable: true, value: request });
  fireEvent.click(screen.getByRole('button', { name: 'Full screen' }));
  await waitFor(() => expect(screen.getByText('Full screen is unavailable here. You can continue in this view.')).toBeTruthy());
  expect(request).toHaveBeenCalledOnce();
  if (original) Object.defineProperty(document, 'fullscreenEnabled', original);
  else Reflect.deleteProperty(document, 'fullscreenEnabled');
});

it('starts cosmetic preview without starting an authoritative round', () => {
  render(<GameHost />);
  fireEvent.click(screen.getByRole('button', { name: 'Try cutting effects' }));
  expect(observed.commands).toEqual([{ type: 'resume' }, { type: 'preview', enabled: true }]);
  expect(screen.getAllByText('Not started')).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', { name: 'Exit effects preview' }));
  expect(observed.commands.at(-1)).toEqual({ type: 'preview', enabled: false });
});

it('removes the settings card while keeping the primary preview available', () => {
  render(<GameHost />);
  expect(screen.queryByText('Arena controls & sound')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Start effects preview' }));
  expect(observed.commands).toEqual([{ type: 'resume' }, { type: 'preview', enabled: true }]);
});

it('keeps essential controls available without opening settings', () => {
  render(<GameHost />);
  const controls = screen.getByRole('group', { name: 'Quick arena controls' });
  expect(controls.closest('details')).toBeNull();
  expect(screen.getByRole('button', { name: 'Pause canvas' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Enable sound' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Full screen' })).toBeTruthy();
  expect(screen.queryByText('Arena controls & sound')).toBeNull();
});
it('shows an actionable canvas failure instead of a ready heading', () => {
  render(<GameHost />);
  act(() => observed.bridge?.emit({ type: 'error', message: 'Renderer unavailable' }));
  expect(screen.getByRole('heading', { name: 'Canvas unavailable' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Retry canvas' })).toBeTruthy();
  expect(screen.getByRole('alert').textContent).toBe('Renderer unavailable');
});

it('prevents page panning from board touches without swallowing game input', () => {
  const view = render(<GameHost />);
  const board = screen.getByLabelText('Game canvas');
  const listener = vi.fn();
  board.addEventListener('touchmove', listener);
  const swipe = new Event('touchmove', { bubbles: true, cancelable: true });
  board.querySelector('.game-canvas')?.dispatchEvent(swipe);
  expect(swipe.defaultPrevented).toBe(true);
  expect(listener).toHaveBeenCalledOnce();
  const outside = new Event('touchmove', { bubbles: true, cancelable: true });
  screen.getByRole('group', { name: 'Quick arena controls' }).dispatchEvent(outside);
  expect(outside.defaultPrevented).toBe(false);
  view.unmount();
  const afterUnmount = new Event('touchmove', { cancelable: true });
  board.dispatchEvent(afterUnmount);
  expect(afterUnmount.defaultPrevented).toBe(false);
});

it('opens settings only from pause and preserves difficulty and fruit choices', () => {
  const prototype = HTMLDialogElement.prototype;
  const show = Object.getOwnPropertyDescriptor(prototype, 'showModal');
  const close = Object.getOwnPropertyDescriptor(prototype, 'close');
  Object.defineProperty(prototype, 'showModal', { configurable: true, value() { this.setAttribute('open', ''); } });
  Object.defineProperty(prototype, 'close', { configurable: true, value() { this.removeAttribute('open'); } });
  const view = render(<GameHost />);
  try {
    expect(screen.queryByRole('button', { name: 'Settings' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Pause canvas' }));
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
    expect(screen.queryByRole('slider')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: 'hard' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'apple' }));
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(observed.commands.filter(command => command.type !== 'configure-preview')).toEqual([{ type: 'pause' }]);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.getByRole('radio', { name: 'hard' }).getAttribute('checked')).not.toBeNull();
    expect(screen.getByRole('checkbox', { name: 'apple' }).getAttribute('checked')).toBeNull();
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: false, cancelable: true }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(observed.commands.filter(command => command.type !== 'configure-preview')).toEqual([{ type: 'pause' }]);
  } finally {
    view.unmount();
    if (show) Object.defineProperty(prototype, 'showModal', show); else Reflect.deleteProperty(prototype, 'showModal');
    if (close) Object.defineProperty(prototype, 'close', close); else Reflect.deleteProperty(prototype, 'close');
  }
});
