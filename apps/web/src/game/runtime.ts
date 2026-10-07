import Phaser from 'phaser';
import type { GameBridge } from './bridge';
import type { GameRuntime } from './lifecycle';
/** Imported only from the browser host. No scoring or replay rules live here. */
export function createRuntime(parent: HTMLElement, bridge: GameBridge): GameRuntime {
  let manuallyPaused = false;
  let visible = true;
  let disposed = false;
  const game = new Phaser.Game({
    type: Phaser.AUTO, parent, transparent: true, width: Math.max(parent.clientWidth, 1), height: Math.max(parent.clientHeight, 1),
    audio: { noAudio: true },
    scene: { create() { bridge.emit({ type: 'ready' }); } },
  });
  const applyPause = () => { if (manuallyPaused || !visible) game.pause(); else game.resume(); };
  const unsubscribe = bridge.onCommand(command => {
    switch (command.type) {
      case 'pause': manuallyPaused = true; applyPause(); break;
      case 'resume': manuallyPaused = false; applyPause(); break;
      case 'start': bridge.emit({ type: 'error', message: 'Round creation and deterministic gameplay rules are not connected yet.' }); break;
      case 'activate-power-up': bridge.emit({ type: 'error', message: 'Inventory authorization and gameplay rules are not connected yet.' }); break;
    }
  });
  return {
    resize(width, height) { if (!disposed) game.scale.resize(Math.max(1, width), Math.max(1, height)); },
    setVisible(value) { visible = value; if (!disposed) applyPause(); },
    destroy() {
      if (disposed) return;
      disposed = true; unsubscribe();
      // Phaser completes pendingDestroy on its next frame; wake a hidden/paused loop first.
      game.destroy(true); if (game.isRunning) game.loop.wake();
    },
  };
}
