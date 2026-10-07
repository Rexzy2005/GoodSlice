import type { RoundDescriptor } from '@goodslice/shared';
export type GameCommand = { type: 'start'; round: RoundDescriptor } | { type: 'pause' } | { type: 'resume' } | { type: 'activate-power-up'; inventoryItemId: string };
export type GameEvent = { type: 'ready' } | { type: 'score-changed'; score: number } | { type: 'lives-changed'; lives: number } | { type: 'power-up-used'; inventoryItemId: string } | { type: 'game-over'; roundId: string } | { type: 'error'; message: string };
export function createGameBridge() {
  const commands = new Set<(command: GameCommand) => void>();
  const events = new Set<(event: GameEvent) => void>();
  return {
    send(command: GameCommand) { for (const listener of commands) listener(command); },
    emit(event: GameEvent) { for (const listener of events) listener(event); },
    onCommand(listener: (command: GameCommand) => void) { commands.add(listener); return () => { commands.delete(listener); }; },
    onEvent(listener: (event: GameEvent) => void) { events.add(listener); return () => { events.delete(listener); }; },
    dispose() { commands.clear(); events.clear(); },
  };
}
export type GameBridge = ReturnType<typeof createGameBridge>;
