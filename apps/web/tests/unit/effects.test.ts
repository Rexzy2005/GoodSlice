import { expect, it } from 'vitest';
import { safeVolume, strokeTouchesFruit } from '../../src/game/effects';
it('detects a fast swipe crossing fruit even when both endpoints are outside', () => {
  expect(strokeTouchesFruit({ x: 0, y: 50 }, { x: 100, y: 50 }, { x: 50, y: 50 }, 15)).toBe(true);
  expect(strokeTouchesFruit({ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 50 }, 15)).toBe(false);
  expect(strokeTouchesFruit({ x: 50, y: 50 }, { x: 50, y: 50 }, { x: 50, y: 50 }, 15)).toBe(false);
});
it('bounds audio volume including non-finite input', () => {
  expect(safeVolume(-1)).toBe(0); expect(safeVolume(2)).toBe(1);
  expect(safeVolume(NaN)).toBe(0); expect(safeVolume(Infinity)).toBe(0); expect(safeVolume(.35)).toBe(.35);
});
