import { DIFFICULTY, ENEMY_CONFIG } from './constants.js';

export function comboMultiplier(combo, difficulty = 'normal') {
  const cap = difficulty === 'arcade' ? 4 : difficulty === 'easy' ? 2.5 : 3;
  return Math.min(cap, 1 + Math.max(0, combo) * 0.08);
}

export function accuracy(correctKeys, totalLetterKeys) {
  if (!totalLetterKeys) return 1;
  return correctKeys / totalLetterKeys;
}

export function calculateScore(enemyType, wordLength, combo = 0, correctKeys = 0, totalLetterKeys = 0, difficulty = 'normal') {
  if (enemyType === 'boss') {
    return Math.round((250 + ENEMY_CONFIG.boss.score * wordLength) * comboMultiplier(combo, difficulty) * DIFFICULTY[difficulty].scoreScale);
  }
  const base = (ENEMY_CONFIG[enemyType]?.score || 10) * wordLength;
  const accuracyBonus = 0.9 + accuracy(correctKeys, totalLetterKeys) * 0.2;
  return Math.round(base * comboMultiplier(combo, difficulty) * accuracyBonus * DIFFICULTY[difficulty].scoreScale);
}

export function calculateWpm(completedWords, elapsedActiveMs) {
  if (!elapsedActiveMs) return 0;
  return Math.round((completedWords / (elapsedActiveMs / 60000)) || 0);
}
