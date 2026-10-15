import { expect, it } from 'vitest';
import { extendBlade, juiceMarks } from '../../src/game/juice-effects';
it('resamples long swipes while keeping trail memory bounded', () => {
  let trail = extendBlade([], { x: 0, y: 0 }, { x: 500, y: 0 });
  expect(trail.length).toBeGreaterThan(2);
  expect(trail.at(-1)).toMatchObject({ x: 500, y: 0 });
  for (let i = 1; i < 100; i++) trail = extendBlade(trail, { x: i * 500, y: 0 }, { x: (i + 1) * 500, y: 0 });
  expect(trail.length).toBeLessThanOrEqual(64);
  expect(trail.every(point => Number.isFinite(point.width) && point.width <= 7)).toBe(true);
});
it('does not extend the blade for a stationary pointer', () => {
  expect(extendBlade([], { x: 4, y: 4 }, { x: 4, y: 4 })).toEqual([]);
});
it('keeps each juice burst bounded and oriented with the cut', () => {
  const marks = juiceMarks(200, 200, Math.PI / 2, () => .5);
  expect(marks).toHaveLength(15);
  expect(marks.every(mark => Math.hypot(mark.x - 200, mark.y - 200) <= 122)).toBe(true);
  expect(marks.every(mark => Math.abs(mark.x - 200) < .001 && mark.y > 200)).toBe(true);
  expect(marks.every(mark => mark.radius > 0 && mark.radius <= 26)).toBe(true);
});
