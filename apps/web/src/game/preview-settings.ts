import { fruitKinds, type FruitKind } from './fruit-texture';
export const difficulties = ['easy', 'normal', 'hard'] as const;
export type Difficulty = typeof difficulties[number];
export interface PreviewSettings { difficulty: Difficulty; fruits: FruitKind[] }
/** Local practice pacing only. These values never govern scored or paid rounds. */
export const difficultyPacing = {
  easy: { maxFruit: 3, maxWave: 2, delay: 1.65, speed: .8 },
  normal: { maxFruit: 6, maxWave: 3, delay: 1.05, speed: 1 },
  hard: { maxFruit: 6, maxWave: 3, delay: .65, speed: 1.25 },
} satisfies Record<Difficulty, { maxFruit: number; maxWave: number; delay: number; speed: number }>;
export function defaultPreviewSettings(): PreviewSettings { return { difficulty: 'normal', fruits: [...fruitKinds] }; }
export function toggleFruit(settings: PreviewSettings, fruit: FruitKind): PreviewSettings {
  if (settings.fruits.includes(fruit)) return settings.fruits.length === 1 ? settings : { ...settings, fruits: settings.fruits.filter(item => item !== fruit) };
  return { ...settings, fruits: [...settings.fruits, fruit] };
}
