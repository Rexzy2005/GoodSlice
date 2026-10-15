import { expect, it } from 'vitest';
import { defaultPreviewSettings, difficultyPacing, toggleFruit } from '../../src/game/preview-settings';
it('retains at least one fruit and allows deselected fruit to be restored', () => {
  let settings = defaultPreviewSettings();
  for (const fruit of settings.fruits.slice(1)) settings = toggleFruit(settings, fruit);
  expect(settings.fruits).toEqual(['melon']);
  expect(toggleFruit(settings, 'melon')).toBe(settings);
  expect(toggleFruit(settings, 'apple').fruits).toEqual(['melon', 'apple']);
});
it('uses distinct slower and faster local-preview pacing', () => {
  expect(difficultyPacing.easy.speed).toBeLessThan(difficultyPacing.normal.speed);
  expect(difficultyPacing.hard.delay).toBeLessThan(difficultyPacing.normal.delay);
  expect(difficultyPacing.easy.maxFruit).toBeLessThan(difficultyPacing.hard.maxFruit);
});
