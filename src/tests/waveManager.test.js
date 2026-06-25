import { describe, expect, it } from 'vitest';
import { createWave, droneCountForWave, isBossWave, waveEnemyCount } from '../game/waveManager.js';

describe('wave manager', () => {
  it('starts wave one with three enemies on normal', () => {
    expect(waveEnemyCount(1, 'normal')).toBe(3);
    expect(createWave(1, 'normal', 900).queue).toHaveLength(3);
  });

  it('increases enemy count over time', () => {
    expect(waveEnemyCount(5, 'normal')).toBeGreaterThan(waveEnemyCount(1, 'normal'));
  });

  it('adds bosses every third wave', () => {
    expect(isBossWave(3)).toBe(true);
    expect(isBossWave(4)).toBe(false);
    const wave = createWave(6, 'normal', 900);
    expect(wave.boss).toBeTruthy();
    expect(wave.drones).toHaveLength(droneCountForWave(6));
  });
});
