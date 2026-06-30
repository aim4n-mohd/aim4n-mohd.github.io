import { ENEMY_CONFIG } from './constants.js';
import { calculateScore } from './scoring.js';
import { createParticles, createProjectile, createScorePopup } from './entities.js';

export function selectableTargets(state) {
  const targets = [...state.enemies, ...state.drones];
  if (state.boss && state.drones.length === 0) targets.push(state.boss);
  return targets.filter((target) => target.remaining.length > 0);
}

export function findTargetForLetter(state, letter) {
  const cannon = state.player;
  return selectableTargets(state)
    .filter((target) => target.remaining[0] === letter)
    .sort((a, b) => {
      const da = Math.hypot(a.x - cannon.x, a.y - cannon.y);
      const db = Math.hypot(b.x - cannon.x, b.y - cannon.y);
      return da - db;
    })[0] || null;
}

export function canTargetBoss(state) {
  return Boolean(state.boss && state.drones.length === 0);
}

function removeTarget(state, target) {
  if (target.type === 'drone') state.drones = state.drones.filter((item) => item.id !== target.id);
  else if (target.type === 'boss') state.boss = null;
  else state.enemies = state.enemies.filter((item) => item.id !== target.id);
}

export function completeTarget(state, target, audio) {
  const points = calculateScore(target.type, target.word.length, state.combo, state.correctKeys, state.totalLetterKeys, state.settings.difficulty);
  state.score += points;
  state.combo += 1;
  state.completedWords += 1;
  state.activeTargetId = null;
  state.particles.push(...createParticles(target.x, target.y, ENEMY_CONFIG[target.type].color, state.settings.reducedMotion ? 8 : target.type === 'boss' ? 42 : 20));
  state.scorePopups.push(createScorePopup(target.x, target.y - 16, `+${points}`));
  removeTarget(state, target);
  if (target.type === 'boss') {
    state.bossesDefeated += 1;
    audio?.play('bossDefeated');
  } else {
    state.enemiesDefeated += 1;
    audio?.play('destroy');
    if (target.type === 'drone' && state.drones.length === 0 && state.boss) {
      state.boss.shielded = false;
      audio?.play('shieldBreak');
    }
  }
}

export function processLetter(state, rawLetter, audio) {
  const letter = String(rawLetter).toLowerCase();
  if (!/^[a-z]$/.test(letter)) return { hit: false };
  state.totalLetterKeys += 1;
  const typedAtMs = state.elapsedActiveMs ?? 0;
  const previousTypedAtMs = state.lastTypingAtMs;
  if (previousTypedAtMs != null) {
    const gapMs = typedAtMs - previousTypedAtMs;
    if (gapMs > 0 && gapMs <= 2000) state.typingActiveMs += gapMs;
  }
  state.lastTypingAtMs = typedAtMs;
  let target = selectableTargets(state).find((item) => item.id === state.activeTargetId);
  if (!target) {
    target = findTargetForLetter(state, letter);
    if (!target) return { hit: false };
    state.activeTargetId = target.id;
  }
  if (target.remaining[0] !== letter) return { hit: false, target };

  target.remaining = target.remaining.slice(1);
  target.health = Math.max(0, target.health - 1);
  target.flash = 0.13;
  state.correctKeys += 1;
  state.projectiles.push(createProjectile(state.player, target));
  state.particles.push(...createParticles(state.player.x, state.player.y - 10, '#55f7ff', state.settings.reducedMotion ? 2 : 5));
  audio?.play('laser');

  if (target.remaining.length === 0) completeTarget(state, target, audio);
  return { hit: true, target };
}
