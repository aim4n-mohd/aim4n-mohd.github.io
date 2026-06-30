import { DIFFICULTY, PLAYFIELD } from './constants.js';
import { createPlayer } from './entities.js';
import { createWave } from './waveManager.js';
import { handleEnemyImpacts } from './collision.js';
import { calculateWpm, comboMultiplier, accuracy } from './scoring.js';

export function createInitialGameState({ width, height, highScore, settings }) {
  const state = {
    status: 'countdown',
    countdownMs: 1800,
    width,
    height,
    wave: 1,
    score: 0,
    highScore,
    health: DIFFICULTY[settings.difficulty].health,
    combo: 0,
    correctKeys: 0,
    totalLetterKeys: 0,
    typingActiveMs: 0,
    lastTypingAtMs: null,
    completedWords: 0,
    enemiesDefeated: 0,
    bossesDefeated: 0,
    activeTargetId: null,
    elapsedActiveMs: 0,
    waveMessageMs: 0,
    spawnCursor: 0,
    spawnElapsed: 0,
    enemies: [],
    boss: null,
    drones: [],
    projectiles: [],
    particles: [],
    scorePopups: [],
    stars: Array.from({ length: 90 }, () => ({ x: Math.random() * width, y: Math.random() * height, z: 0.25 + Math.random() * 0.9 })),
    player: createPlayer(width, height, DIFFICULTY[settings.difficulty].health),
    settings,
    shake: 0,
    currentWave: createWave(1, settings.difficulty, width)
  };
  return state;
}

export function resizeState(state, width, height) {
  const sx = width / state.width;
  const sy = height / state.height;
  state.width = width;
  state.height = height;
  state.player.x = width / 2;
  state.player.y = height - PLAYFIELD.cannonBottomOffset;
  [...state.enemies, ...state.drones, state.boss].filter(Boolean).forEach((entity) => {
    entity.x *= sx;
    entity.y *= sy;
  });
}

function spawnDueEnemies(state) {
  const queue = state.currentWave.queue;
  while (state.spawnCursor < queue.length && queue[state.spawnCursor].delay <= state.spawnElapsed) {
    state.enemies.push(queue[state.spawnCursor].enemy);
    state.spawnCursor += 1;
  }
}

export function beginNextWave(state) {
  state.wave += 1;
  state.currentWave = createWave(state.wave, state.settings.difficulty, state.width);
  state.spawnCursor = 0;
  state.spawnElapsed = 0;
  state.enemies = [];
  state.boss = state.currentWave.boss;
  state.drones = state.currentWave.drones;
  state.activeTargetId = null;
  state.status = 'playing';
}

function updateEntities(state, dt) {
  state.stars.forEach((star) => {
    star.y += 12 * star.z * dt;
    if (star.y > state.height) {
      star.y = 0;
      star.x = Math.random() * state.width;
    }
  });
  state.enemies.forEach((enemy) => {
    enemy.y += enemy.speed * dt;
    enemy.x += enemy.drift * dt;
    enemy.x = Math.max(44, Math.min(state.width - 44, enemy.x));
    enemy.flash = Math.max(0, enemy.flash - dt);
  });
  if (state.boss) {
    state.boss.y += state.boss.speed * dt;
    state.boss.flash = Math.max(0, state.boss.flash - dt);
    state.drones.forEach((drone) => {
      drone.angle += drone.orbitSpeed * dt;
      drone.x = state.boss.x + Math.cos(drone.angle) * drone.orbitRadius;
      drone.y = state.boss.y + Math.sin(drone.angle) * drone.orbitRadius * 0.64;
      drone.flash = Math.max(0, drone.flash - dt);
    });
  }
}

function updateFx(state, dt) {
  state.projectiles.forEach((p) => {
    p.life += dt;
    const t = Math.min(1, p.life / p.duration);
    p.x = p.fromX + (p.toX - p.fromX) * t;
    p.y = p.fromY + (p.toY - p.fromY) * t;
  });
  state.projectiles = state.projectiles.filter((p) => p.life < p.duration);
  state.particles.forEach((p) => {
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 90 * dt;
  });
  state.particles = state.particles.filter((p) => p.life > 0);
  state.scorePopups.forEach((p) => {
    p.life -= dt;
    p.y -= 34 * dt;
  });
  state.scorePopups = state.scorePopups.filter((p) => p.life > 0);
  state.shake = Math.max(0, state.shake - 45 * dt);
}

export function updateGame(state, deltaMs, audio) {
  const dt = Math.min(0.05, deltaMs / 1000);
  if (state.status === 'countdown') {
    state.countdownMs -= deltaMs;
    updateFx(state, dt);
    if (state.countdownMs <= 0) {
      state.status = 'playing';
      state.boss = state.currentWave.boss;
      state.drones = state.currentWave.drones;
    }
    return;
  }
  if (state.status === 'wave-complete') {
    state.waveMessageMs -= deltaMs;
    updateFx(state, dt);
    if (state.waveMessageMs <= 0) beginNextWave(state);
    return;
  }
  if (state.status !== 'playing') return;

  state.elapsedActiveMs += deltaMs;
  state.spawnElapsed += deltaMs;
  spawnDueEnemies(state);
  updateEntities(state, dt);
  handleEnemyImpacts(state, audio);
  updateFx(state, dt);

  if (state.health <= 0) {
    state.health = 0;
    state.status = 'game-over';
    audio?.play('gameOver');
    return;
  }

  const allSpawned = state.spawnCursor >= state.currentWave.queue.length;
  if (allSpawned && state.enemies.length === 0 && state.drones.length === 0 && !state.boss) {
    state.status = 'wave-complete';
    state.waveMessageMs = 1550;
    state.activeTargetId = null;
  }
}

export function currentStats(state) {
  return {
    score: Math.floor(state.score),
    highScore: Math.max(state.highScore, Math.floor(state.score)),
    wave: state.wave,
    health: state.health,
    accuracy: accuracy(state.correctKeys, state.totalLetterKeys),
    wpm: calculateWpm(state.correctKeys, state.typingActiveMs),
    comboMultiplier: comboMultiplier(state.combo, state.settings.difficulty),
    combo: state.combo,
    enemiesDefeated: state.enemiesDefeated,
    bossesDefeated: state.bossesDefeated,
    survivalMs: state.elapsedActiveMs
  };
}
