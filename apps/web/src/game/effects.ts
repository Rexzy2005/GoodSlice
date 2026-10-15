/** Cosmetic feedback only. Never used for scoring or authoritative replay. */
export const soundCues = ['click', 'swipe', 'cut', 'splash', 'boom', 'fail', 'success', 'combo'] as const;
export type SoundCue = typeof soundCues[number];
export interface Point { x: number; y: number }
export function strokeTouchesFruit(a: Point, b: Point, center: Point, radius: number): boolean {
  const dx = b.x - a.x, dy = b.y - a.y;
  const length = dx * dx + dy * dy;
  if (length < 4) return false;
  const t = Math.max(0, Math.min(1, ((center.x - a.x) * dx + (center.y - a.y) * dy) / length));
  return Math.hypot(center.x - a.x - t * dx, center.y - a.y - t * dy) <= radius;
}
export function safeVolume(value: number): number { return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0; }
