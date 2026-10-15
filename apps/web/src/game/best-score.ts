import type { Difficulty } from './preview-settings';
/** Per-device practice best. Storage can be unavailable (private mode); callers get null. */
const key = (difficulty: Difficulty) => 'slyce.practice.best.' + difficulty;
export function readBestScore(difficulty: Difficulty): number | null {
  try {
    const value = Number(window.localStorage.getItem(key(difficulty)));
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  } catch { return null; }
}
/** Returns the best score after recording; `improved` is true when the new score beat the stored one. */
export function recordBestScore(difficulty: Difficulty, score: number): { best: number; improved: boolean } {
  const previous = readBestScore(difficulty) ?? 0;
  if (score <= previous) return { best: previous, improved: false };
  try { window.localStorage.setItem(key(difficulty), String(score)); } catch { /* Best stays in this session only. */ }
  return { best: score, improved: true };
}
