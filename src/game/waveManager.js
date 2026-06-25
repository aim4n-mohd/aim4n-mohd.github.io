import { DIFFICULTY } from './constants.js';
import { chooseWord } from './wordService.js';
import { createBoss, createDrone, createEnemy } from './entities.js';

export function waveEnemyCount(wave, difficulty = 'normal') {
  const base = Math.min(3 + Math.floor((wave - 1) * 1.35), 24);
  return Math.max(2, Math.round(base * DIFFICULTY[difficulty].enemyScale));
}

export function waveSpeedMultiplier(wave, difficulty = 'normal') {
  return (1 + (wave - 1) * 0.045) * DIFFICULTY[difficulty].speedScale;
}

export function waveSpawnInterval(wave, difficulty = 'normal') {
  return Math.max(420, 1400 - wave * 55) * DIFFICULTY[difficulty].spawnScale;
}

export function isBossWave(wave) {
  return wave > 0 && wave % 3 === 0;
}

export function enemyTypeForWave(wave) {
  const roll = Math.random();
  if (wave <= 2) return 'standard';
  if (wave <= 5) return roll < 0.72 ? 'standard' : 'fast';
  if (roll < 0.5) return 'standard';
  if (roll < 0.8) return 'fast';
  return 'heavy';
}

function wordRangeForType(type, wave) {
  if (type === 'fast') return { min: 2, max: Math.min(4, 3 + Math.floor(wave / 6)) };
  if (type === 'heavy') return { min: 6, max: Math.min(8, 6 + Math.floor(wave / 4)) };
  return { min: 3, max: Math.min(6, 4 + Math.floor(wave / 4)) };
}

export function droneCountForWave(wave) {
  if (wave < 6) return 2;
  if (wave < 12) return 3;
  if (wave < 18) return 4;
  return 5;
}

export function createWave(wave, difficulty = 'normal', width = 960) {
  const avoidStarts = new Set();
  const speedMultiplier = waveSpeedMultiplier(wave, difficulty);
  const queue = [];
  const count = waveEnemyCount(wave, difficulty);
  const normalCount = isBossWave(wave) ? Math.max(2, Math.round(count * 0.62)) : count;

  for (let i = 0; i < normalCount; i += 1) {
    const type = enemyTypeForWave(wave);
    const range = wordRangeForType(type, wave);
    const word = chooseWord({ ...range, avoidStarts });
    avoidStarts.add(word[0]);
    queue.push({
      kind: 'enemy',
      delay: i * waveSpawnInterval(wave, difficulty),
      enemy: createEnemy({ type, word, wave, width, speedMultiplier })
    });
  }

  let boss = null;
  let drones = [];
  if (isBossWave(wave)) {
    const word = chooseWord({ min: 10, max: 15, boss: true, avoidStarts });
    boss = createBoss({ word, wave, width, speedMultiplier });
    const droneTotal = droneCountForWave(wave);
    drones = Array.from({ length: droneTotal }, (_, index) => {
      const droneWord = chooseWord({ min: 2, max: 4, avoidStarts });
      avoidStarts.add(droneWord[0]);
      return createDrone({ word: droneWord, boss, index, total: droneTotal });
    });
  }

  return {
    wave,
    spawnInterval: waveSpawnInterval(wave, difficulty),
    queue,
    boss,
    drones
  };
}
