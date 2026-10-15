// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { createGameAudio } from '../../src/game/audio';
const contexts: FakeContext[] = [];
const parameter = () => ({ value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
class FakeNode {
  gain = parameter(); frequency = parameter(); threshold = parameter(); ratio = parameter();
  type = ''; buffer: unknown = null; onended: (() => void) | null = null;
  connect = vi.fn(); disconnect = vi.fn(); start = vi.fn(); stop = vi.fn();
}
class FakeContext {
  state = 'suspended'; currentTime = 1; sampleRate = 64; destination = {}; sources: FakeNode[] = []; gains: FakeNode[] = [];
  constructor() { contexts.push(this); }
  resume = vi.fn(async () => { this.state = 'running'; });
  close = vi.fn(async () => { this.state = 'closed'; });
  createGain() { const node = new FakeNode(); this.gains.push(node); return node; }
  createDynamicsCompressor() { return new FakeNode(); }
  createBuffer() { return { getChannelData: () => new Float32Array(64) }; }
  createBiquadFilter() { return new FakeNode(); }
  createOscillator() { const node = new FakeNode(); this.sources.push(node); return node; }
  createBufferSource() { return this.createOscillator(); }
}
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); contexts.length = 0; });
it('requires opt-in, caps voices and closes audio resources', async () => {
  vi.stubGlobal('AudioContext', FakeContext);
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  const audio = createGameAudio(); audio.play('cut'); expect(contexts).toHaveLength(0);
  expect(await audio.enable()).toBe(true);
  const context = contexts.at(0); if (!context) throw new Error('Missing test context');
  for (let i = 0; i < 30; i++) { context.currentTime += .2; audio.play('cut'); }
  expect(context.sources).toHaveLength(16);
  audio.mute(); expect(context.sources.every(node => node.stop.mock.calls.length >= 2)).toBe(true);
  const count = context.sources.length; audio.play('boom'); expect(context.sources).toHaveLength(count);
  audio.dispose(); expect(context.close).toHaveBeenCalledOnce(); expect(await audio.enable()).toBe(false);
});
it('stops scheduled sound when the page becomes hidden', async () => {
  vi.stubGlobal('AudioContext', FakeContext);
  const audio = createGameAudio(); await audio.enable(); audio.play('success');
  const context = contexts.at(0); if (!context) throw new Error('Missing test context');
  expect(context.sources).toHaveLength(3);
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  document.dispatchEvent(new Event('visibilitychange'));
  expect(context.sources.every(node => node.stop.mock.calls.length >= 2)).toBe(true);
  const count = context.sources.length; audio.play('fail'); expect(context.sources).toHaveLength(count);
  audio.dispose();
});
