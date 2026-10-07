/** Frontend replay boundary, not a final backend wire schema or game ruleset. */
export type RoundId = string;
export type RulesVersion = string;
export interface RoundDescriptor {
  readonly roundId: RoundId;
  readonly seed: string;
  readonly rulesVersion: RulesVersion;
}
/** Elapsed integer milliseconds; coordinates normalized to [0, 1]. */
export interface PointerInput {
  readonly kind: 'pointer';
  readonly phase: 'down' | 'move' | 'up';
  readonly elapsedMs: number;
  readonly x: number;
  readonly y: number;
}
export interface ItemInput {
  readonly kind: 'item';
  readonly elapsedMs: number;
  readonly inventoryItemId: string;
}
export type ReplayInput = PointerInput | ItemInput;
export interface RoundSubmission {
  readonly round: RoundDescriptor;
  readonly inputs: readonly ReplayInput[];
}
// Scoring, RNG and simulation require approved rules; no local score authority.
