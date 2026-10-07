import { describe, expect, it, vi } from 'vitest';
import { createGameBridge } from '../../src/game/bridge';
import { mountRuntime, type GameRuntime } from '../../src/game/lifecycle';
describe('game lifecycle', () => {
  it('destroys a runtime resolving after unmount exactly once', async () => {
    let resolve!: (runtime: GameRuntime) => void;
    const runtime = { resize: vi.fn(), setVisible: vi.fn(), destroy: vi.fn() };
    const mounted = mountRuntime(() => new Promise(value => { resolve = value; }), vi.fn());
    mounted.dispose(); mounted.dispose(); resolve(runtime); await mounted.ready;
    expect(runtime.destroy).toHaveBeenCalledTimes(1); expect(runtime.setVisible).not.toHaveBeenCalled();
  });
  it('replays the most recent dimensions and visibility after async loading', async () => {
    const runtime = { resize: vi.fn(), setVisible: vi.fn(), destroy: vi.fn() };
    const mounted = mountRuntime(async () => runtime, vi.fn()); mounted.resize(360, 480); mounted.setVisible(false); await mounted.ready;
    expect(runtime.resize).toHaveBeenCalledWith(360, 480); expect(runtime.setVisible).toHaveBeenCalledWith(false); mounted.dispose();
  });
  it('does not leak bridge subscribers', () => {
    const bridge = createGameBridge(); const listener = vi.fn(); const off = bridge.onEvent(listener);
    bridge.emit({ type: 'ready' }); off(); bridge.emit({ type: 'ready' }); bridge.dispose(); expect(listener).toHaveBeenCalledTimes(1);
  });
});
