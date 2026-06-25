import { ENEMY_CONFIG } from './constants.js';
import { createParticles } from './entities.js';

export function handleEnemyImpacts(state, audio) {
  const dangerY = state.height - 82;
  const impacted = [];
  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.y + enemy.radius >= dangerY) {
      impacted.push(enemy);
      return false;
    }
    return true;
  });

  if (state.boss && state.boss.y + state.boss.radius >= dangerY) {
    impacted.push(state.boss);
    state.boss = null;
    state.drones = [];
  }

  impacted.forEach((enemy) => {
    state.health -= ENEMY_CONFIG[enemy.type].damage;
    state.combo = 0;
    state.activeTargetId = state.activeTargetId === enemy.id ? null : state.activeTargetId;
    state.shake = state.settings.screenShake && !state.settings.reducedMotion ? 10 : 0;
    state.particles.push(...createParticles(enemy.x, enemy.y, ENEMY_CONFIG[enemy.type].color, state.settings.reducedMotion ? 8 : 24));
    audio?.play('damage');
  });

  return impacted.length;
}
