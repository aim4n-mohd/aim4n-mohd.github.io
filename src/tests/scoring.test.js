import { describe, expect, it } from 'vitest';
import { accuracy, calculateScore, calculateWpm, comboMultiplier } from '../game/scoring.js';

describe('scoring', () => {
  it('calculates score by enemy type and word length', () => {
    expect(calculateScore('standard', 5, 0, 5, 5)).toBe(55);
    expect(calculateScore('fast', 3, 0, 3, 3)).toBe(26);
    expect(calculateScore('heavy', 7, 0, 7, 7)).toBe(123);
    expect(calculateScore('boss', 12, 0, 12, 12)).toBe(550);
  });

  it('grows combo multiplier gently', () => {
    expect(comboMultiplier(0)).toBe(1);
    expect(comboMultiplier(5)).toBeCloseTo(1.4);
    expect(comboMultiplier(100)).toBe(3);
    expect(comboMultiplier(100, 'arcade')).toBe(4);
  });

  it('calculates accuracy and WPM', () => {
    expect(accuracy(7, 10)).toBe(0.7);
    expect(accuracy(0, 0)).toBe(1);
    expect(calculateWpm(12, 120000)).toBe(6);
  });
});
