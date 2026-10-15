import type { Point } from './effects';
/** Bounded visual effects, independent of authoritative game state. */
export interface BladePoint extends Point { life: number; width: number }
export function extendBlade(points: BladePoint[], a: Point, b: Point): BladePoint[] {
  const distance = Math.hypot(b.x - a.x, b.y - a.y);
  if (distance < 2) return points;
  const count = Math.min(32, Math.ceil(distance / 7));
  const width = Math.min(7, 2 + distance * .035);
  const next = points.slice();
  if (!next.length) next.push({ ...a, life: 1, width: 1 });
  for (let i = 1; i <= count; i++) { const t = i / count; next.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, life: 1, width }); }
  return next.slice(-64);
}
export interface JuiceMark extends Point { radius: number; stretch: number; angle: number }
export function juiceMarks(x: number, y: number, angle: number, random: () => number = Math.random): JuiceMark[] {
  const marks: JuiceMark[] = [];
  for (let i = 0; i < 15; i++) {
    const direction = angle + (random() - .5) * Math.PI * 1.5;
    const reach = i < 5 ? random() * 23 : 28 + random() * 94;
    marks.push({ x: x + Math.cos(direction) * reach, y: y + Math.sin(direction) * reach,
      radius: i < 5 ? 10 + random() * 16 : 2 + random() * 6, stretch: 1 + random() * 1.6, angle: direction });
  }
  return marks;
}
