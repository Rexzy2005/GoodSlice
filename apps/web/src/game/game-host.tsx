'use client';
import { useEffect, useRef, useState } from 'react';
import { createGameBridge } from './bridge';
import { mountRuntime } from './lifecycle';
export function GameHost() {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Preparing the game canvas…');
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const parent = container.current;
    if (!parent) return;
    let cancelled = false;
    const bridge = createGameBridge();
    const unsubscribe = bridge.onEvent(event => {
      if (event.type === 'ready') setStatus('Canvas ready. Play will open when verified rounds are available.');
      if (event.type === 'error') { setStatus(event.message); setFailed(true); }
    });
    const mounted = mountRuntime(async () => {
      const { createRuntime } = await import('./runtime');
      if (cancelled) return { resize() {}, setVisible() {}, destroy() {} };
      return createRuntime(parent, bridge);
    }, () => { setFailed(true); setStatus('The game canvas could not load. Please retry.'); });
    const observer = new ResizeObserver(entries => {
      const bounds = entries[0]?.contentRect;
      if (bounds) mounted.resize(bounds.width, bounds.height);
    });
    observer.observe(parent);
    const visibility = () => mounted.setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', visibility);
    visibility();
    return () => { cancelled = true; observer.disconnect(); document.removeEventListener('visibilitychange', visibility); unsubscribe(); mounted.dispose(); bridge.dispose(); };
  }, [attempt]);
  return <section className="game-stage" aria-label="Game canvas">
    <div ref={container} className="game-canvas" aria-hidden="true" />
    <div className="game-overlay"><span className="eyebrow">THE CUTTING FLOOR</span><h2>Your next slice<br />starts here.</h2>
      <p role={failed ? 'alert' : 'status'}>{status}</p>
      {failed ? <button className="button" onClick={() => { setFailed(false); setStatus('Preparing the game canvas…'); setAttempt(value => value + 1); }}>Retry canvas</button>
        : <button className="button" disabled aria-describedby="round-boundary">Start round</button>}
      <p id="round-boundary" className="muted">Rounds are not available yet. No score or reward is being recorded.</p>
    </div>
  </section>;
}
