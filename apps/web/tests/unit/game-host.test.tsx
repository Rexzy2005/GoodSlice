// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { attachGameHost } from '../../src/game/host-lifecycle';
import { createGameBridge } from '../../src/game/bridge';
import type { GameRuntime } from '../../src/game/lifecycle';

const disconnect = vi.fn();
class TestResizeObserver implements ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect = disconnect;
}
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

it('tracks visibility and removes its listeners and renderer on unmount', async () => {
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
  const runtime = { resize: vi.fn(), setVisible: vi.fn(), destroy: vi.fn() };
  const host = attachGameHost(document.createElement('div'), createGameBridge(), async () => ({ createRuntime: () => runtime }), vi.fn());
  await host.ready;
  expect(runtime.setVisible).toHaveBeenCalledWith(true);
  visibility.mockReturnValue('hidden');
  document.dispatchEvent(new Event('visibilitychange'));
  expect(runtime.setVisible).toHaveBeenLastCalledWith(false);
  host.dispose(); host.dispose();
  expect(runtime.destroy).toHaveBeenCalledTimes(1);
  expect(disconnect).toHaveBeenCalledTimes(1);
  const count = runtime.setVisible.mock.calls.length;
  document.dispatchEvent(new Event('visibilitychange'));
  expect(runtime.setVisible).toHaveBeenCalledTimes(count);
});

it('does not initialize a renderer after a cancelled asynchronous import', async () => {
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  let resolve!: (module: { createRuntime(): GameRuntime }) => void;
  const createRuntime = vi.fn(() => ({ resize() {}, setVisible() {}, destroy() {} }));
  const host = attachGameHost(document.createElement('div'), createGameBridge(), () => new Promise(value => { resolve = value; }), vi.fn());
  host.dispose(); resolve({ createRuntime }); await host.ready;
  expect(createRuntime).not.toHaveBeenCalled();
});

it('reports failed imports and can be disposed safely', async () => {
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  const error = new Error('chunk unavailable'); const failed = vi.fn();
  const host = attachGameHost(document.createElement('div'), createGameBridge(), async () => { throw error; }, failed);
  await host.ready;
  expect(failed).toHaveBeenCalledWith(error);
  host.dispose();
});
