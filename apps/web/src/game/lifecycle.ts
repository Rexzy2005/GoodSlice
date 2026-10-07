export interface GameRuntime { resize(width: number, height: number): void; setVisible(visible: boolean): void; destroy(): void }
/** Makes an async browser-only import safe against unmount and React Strict Mode. */
export function mountRuntime(load: () => Promise<GameRuntime>, failed: (error: unknown) => void) {
  let disposed = false;
  let runtime: GameRuntime | undefined;
  let dimensions: [number, number] | undefined;
  let visible = true;
  const ready = load().then(value => {
    if (disposed) { value.destroy(); return; }
    runtime = value;
    if (dimensions) runtime.resize(...dimensions);
    runtime.setVisible(visible);
  }).catch(error => {
    // Loading can succeed while resize/visibility initialization fails.
    const failedRuntime = runtime;
    runtime = undefined;
    let failure: unknown = error;
    try { failedRuntime?.destroy(); }
    catch (cleanupError) { failure = new AggregateError([error, cleanupError], 'Game initialization and cleanup failed'); }
    if (!disposed) failed(failure);
  });
  return {
    ready,
    resize(width: number, height: number) { dimensions = [width, height]; if (!disposed) runtime?.resize(width, height); },
    setVisible(value: boolean) { visible = value; if (!disposed) runtime?.setVisible(value); },
    dispose() { if (!disposed) { disposed = true; runtime?.destroy(); runtime = undefined; } },
  };
}
