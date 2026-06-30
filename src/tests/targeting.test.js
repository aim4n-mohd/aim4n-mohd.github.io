import { describe, expect, it, vi } from 'vitest';
import { processLetter, canTargetBoss } from '../game/input.js';

function testState() {
  return {
    player: { x: 100, y: 500 },
    settings: { difficulty: 'normal', reducedMotion: true },
    enemies: [
      { id: 'far', type: 'standard', word: 'cat', remaining: 'cat', x: 50, y: 100, health: 3 },
      { id: 'near', type: 'standard', word: 'cab', remaining: 'cab', x: 100, y: 430, health: 3 }
    ],
    drones: [],
    boss: null,
    activeTargetId: null,
    totalLetterKeys: 0,
    correctKeys: 0,
    elapsedActiveMs: 0,
    typingActiveMs: 0,
    lastTypingAtMs: null,
    combo: 0,
    score: 0,
    completedWords: 0,
    particles: [],
    projectiles: [],
    scorePopups: [],
    enemiesDefeated: 0,
    bossesDefeated: 0
  };
}

describe('targeting', () => {
  it('first correct letter locks the most dangerous matching target', () => {
    const state = testState();
    processLetter(state, 'c');
    expect(state.activeTargetId).toBe('near');
    expect(state.enemies.find((e) => e.id === 'near').remaining).toBe('ab');
  });

  it('locked target only accepts next correct letter and wrong letters do not damage', () => {
    const state = testState();
    processLetter(state, 'c');
    processLetter(state, 'z');
    expect(state.enemies.find((e) => e.id === 'near').remaining).toBe('ab');
    processLetter(state, 'a');
    expect(state.enemies.find((e) => e.id === 'near').remaining).toBe('b');
  });

  it('clears lock after word completion', () => {
    const state = testState();
    processLetter(state, 'c', { play: vi.fn() });
    processLetter(state, 'a', { play: vi.fn() });
    processLetter(state, 'b', { play: vi.fn() });
    expect(state.activeTargetId).toBeNull();
    expect(state.enemies.some((e) => e.id === 'near')).toBe(false);
  });

  it('blocks boss targeting until drones are gone', () => {
    const state = testState();
    state.enemies = [];
    state.boss = { id: 'boss', type: 'boss', word: 'transmission', remaining: 'transmission', x: 100, y: 100, health: 12 };
    state.drones = [{ id: 'drone', type: 'drone', word: 'to', remaining: 'to', x: 90, y: 90, health: 2 }];
    expect(canTargetBoss(state)).toBe(false);
    processLetter(state, 't');
    expect(state.activeTargetId).toBe('drone');
    state.drones = [];
    state.activeTargetId = null;
    expect(canTargetBoss(state)).toBe(true);
    processLetter(state, 't');
    expect(state.activeTargetId).toBe('boss');
  });
});
