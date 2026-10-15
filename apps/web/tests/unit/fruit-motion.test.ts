import { expect, it } from 'vitest';
import { advanceFruit, launchFruit, splitFruit } from '../../src/game/fruit-motion';
it('launches below the board, peaks within reach, then falls beyond the bottom', () => {
  for (const width of [336, 900, 1380]) for (const sample of [0, .5, 1]) {
    const height = 600, radius = 36;
    const body = launchFruit(width, height, radius, () => sample);
    expect(body.y - radius).toBeGreaterThan(height);
    expect(body.vy).toBeLessThan(0);
    const apexTime = -body.vy / body.gravity;
    advanceFruit(body, apexTime);
    expect(body.vy).toBeCloseTo(0);
    expect(body.y).toBeGreaterThan(height * .17);
    expect(body.y).toBeLessThan(height * .43);
    expect(body.x).toBeGreaterThan(radius);
    expect(body.x).toBeLessThan(width - radius);
    advanceFruit(body, apexTime + .2);
    expect(body.vy).toBeGreaterThan(0);
    expect(body.y - radius).toBeGreaterThan(height);
  }
});
it('follows the same arc at different refresh rates', () => {
  const initial = launchFruit(900, 600, 40, () => .5);
  const whole = { ...initial }, frames = { ...initial };
  advanceFruit(whole, 1);
  for (let i = 0; i < 120; i++) advanceFruit(frames, 1 / 120);
  for (const key of ['x', 'y', 'vx', 'vy', 'angle'] as const) expect(frames[key]).toBeCloseTo(whole[key], 8);
});
it('splits perpendicular to the swipe while preserving parent momentum', () => {
  const body = launchFruit(900, 600, 40, () => .5);
  for (const angle of [0, Math.PI / 2, -.7]) {
    const [a, b] = splitFruit(body, angle);
    expect((a.vx + b.vx) / 2).toBeCloseTo(body.vx);
    expect((a.vy + b.vy) / 2).toBeCloseTo(body.vy);
    expect((a.vx - b.vx) * Math.cos(angle) + (a.vy - b.vy) * Math.sin(angle)).toBeCloseTo(0);
    expect(a.angle).toBe(angle); expect(b.angle).toBe(angle);
  }
});
