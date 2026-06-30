export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  volume: 0.5,
  screenShake: true,
  reducedMotion: false,
  difficulty: 'normal'
};

export const DIFFICULTY = {
  easy: { enemyScale: 0.82, speedScale: 0.82, spawnScale: 1.16, health: 120, scoreScale: 0.9 },
  normal: { enemyScale: 1, speedScale: 1, spawnScale: 1, health: 100, scoreScale: 1 },
  arcade: { enemyScale: 1.1, speedScale: 1.13, spawnScale: 0.84, health: 100, scoreScale: 1.15 }
};

export const ENEMY_CONFIG = {
  standard: { radius: 20, color: '#6957ff', speed: 34, damage: 12, score: 10 },
  fast: { radius: 15, color: '#ff4f8b', speed: 58, damage: 8, score: 8 },
  heavy: { radius: 27, color: '#23d69b', speed: 24, damage: 20, score: 16 },
  drone: { radius: 13, color: '#ffd45a', speed: 0, damage: 10, score: 12 },
  boss: { radius: 48, color: '#d85cff', speed: 9, damage: 35, score: 25 }
};

export const STORAGE_KEYS = {
  settings: 'typeblaster.settings',
  highScore: 'typeblaster.highScore',
  dictionaryCache: 'typeblaster.dictionaryCache'
};

export const PLAYFIELD = {
  cannonBottomOffset: 92,
  dangerZoneOffset: 118
};
