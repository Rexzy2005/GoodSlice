import type { GameBridge } from './bridge';
import { mountRuntime, type GameRuntime } from './lifecycle';

type RuntimeModule = { createRuntime(parent: HTMLElement, bridge: GameBridge): GameRuntime };

/** Browser lifecycle is independent of the renderer and its asynchronous module loader. */
export function attachGameHost(
  parent: HTMLElement,
  bridge: GameBridge,
  load: () => Promise<RuntimeModule>,
  failed: (error: unknown) => void,
) {
  let cancelled = false;
  const mounted = mountRuntime(async () => {
    const module = await load();
    if (cancelled) return { resize() {}, setVisible() {}, destroy() {} };
    return module.createRuntime(parent, bridge);
  }, failed);
  const observer = new ResizeObserver(entries => {
    const bounds = entries[0]?.contentRect;
    if (bounds) mounted.resize(bounds.width, bounds.height);
  });
  observer.observe(parent);
  const visibility = () => mounted.setVisible(document.visibilityState === 'visible');
  document.addEventListener('visibilitychange', visibility);
  visibility();
  return {
    ready: mounted.ready,
    dispose() {
      if (cancelled) return;
      cancelled = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      mounted.dispose();
    },
  };
}
