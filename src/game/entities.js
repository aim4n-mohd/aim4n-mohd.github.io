import { ENEMY_CONFIG, PLAYFIELD } from './constants.js';
import { rand, stableId } from './math.js';

export function createPlayer(width, height, health) {
  return { x: width / 2, y: height - PLAYFIELD.cannonBottomOffset, health };
}

export function createEnemy({ type = 'standard', word, wave = 1, width = 960, speedMultiplier = 1 }) {
  const config = ENEMY_CONFIG[type];
  return {
    id: stableId(type),
    type,
    word,
    remaining: word,
    x: rand(70, Math.max(80, width - 70)),
    y: rand(-90, -28),
    drift: rand(-10, 10),
    radius: config.radius,
    speed: config.speed * speedMultiplier * rand(0.92, 1.12),
    maxHealth: word.length,
    health: word.length,
    flash: 0,
    wave
  };
}

export function createBoss({ word, wave, width, speedMultiplier }) {
  return {
    id: stableId('boss'),
    type: 'boss',
    word,
    remaining: word,
    x: width / 2,
    y: 112,
    drift: 0,
    radius: ENEMY_CONFIG.boss.radius,
    speed: ENEMY_CONFIG.boss.speed * speedMultiplier,
    maxHealth: word.length,
    health: word.length,
    flash: 0,
    shielded: true,
    wave
  };
}

export function createDrone({ word, boss, index, total }) {
  return {
    id: stableId('drone'),
    type: 'drone',
    word,
    remaining: word,
    angle: (Math.PI * 2 * index) / total,
    orbitRadius: 86 + (index % 2) * 16,
    orbitSpeed: 0.75 + index * 0.05,
    x: boss.x,
    y: boss.y,
    radius: ENEMY_CONFIG.drone.radius,
    speed: 0,
    maxHealth: word.length,
    health: word.length,
    flash: 0
  };
}

export function createProjectile(from, to) {
  return {
    id: stableId('laser'),
    x: from.x,
    y: from.y,
    fromX: from.x,
    fromY: from.y,
    toX: to.x,
    toY: to.y,
    life: 0,
    duration: 0.11
  };
}

export function createParticles(x, y, color, count = 16) {
  return Array.from({ length: count }, () => ({
    id: stableId('p'),
    x,
    y,
    vx: rand(-110, 110),
    vy: rand(-120, 80),
    life: rand(0.28, 0.72),
    maxLife: 0.72,
    size: rand(1.6, 4.2),
    color
  }));
}

export function createScorePopup(x, y, text) {
  return { id: stableId('score'), x, y, text, life: 0.85 };
}
