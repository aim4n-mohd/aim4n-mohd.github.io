import { useEffect, useRef, useState } from 'react';
import { ENEMY_CONFIG, PLAYFIELD } from './constants.js';
import { createInitialGameState, currentStats, resizeState, updateGame } from './gameLoop.js';
import { processLetter } from './input.js';

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

function AdBanner() {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense can throw while approval or ad blocking is in progress.
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', width: '100%', minHeight: '60px' }}
      data-ad-client="ca-pub-7842283632747268"
      data-ad-slot="5192750955"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

function drawEnemy(ctx, enemy, active) {
  const config = ENEMY_CONFIG[enemy.type];
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  const pulse = enemy.flash > 0 ? 1.24 : 1;
  ctx.fillStyle = enemy.flash > 0 ? '#ffffff' : config.color;
  ctx.shadowColor = active ? '#ff9f32' : config.color;
  ctx.shadowBlur = active ? 22 : 12;
  if (enemy.type === 'heavy') {
    ctx.beginPath();
    ctx.roundRect(-enemy.radius, -enemy.radius * 0.75, enemy.radius * 2, enemy.radius * 1.5, 8);
    ctx.fill();
  } else if (enemy.type === 'boss') {
    ctx.beginPath();
    ctx.moveTo(0, -enemy.radius * pulse);
    ctx.lineTo(enemy.radius * pulse, 0);
    ctx.lineTo(0, enemy.radius * pulse);
    ctx.lineTo(-enemy.radius * pulse, 0);
    ctx.closePath();
    ctx.fill();
    if (enemy.shielded) {
      ctx.strokeStyle = 'rgba(255, 212, 90, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.radius + 20, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius * pulse, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  drawWord(ctx, enemy, active);
}

function drawWord(ctx, enemy, active) {
  const label = enemy.remaining || enemy.word;
  ctx.save();
  ctx.font = active ? '700 22px "Trebuchet MS", sans-serif' : '700 18px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 5;
  const y = enemy.type === 'drone' ? enemy.y - 27 : enemy.y + enemy.radius + 24;
  ctx.strokeStyle = 'rgba(2, 8, 22, 0.95)';
  ctx.fillStyle = active ? '#ff9f32' : enemy.type === 'boss' && enemy.shielded ? 'rgba(190, 196, 220, 0.62)' : '#f5fbff';
  ctx.strokeText(label, enemy.x, y);
  ctx.fillText(label, enemy.x, y);
  ctx.restore();
}

function render(ctx, state) {
  const { width, height } = state;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  if (state.shake > 0) ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#050914');
  bg.addColorStop(1, '#071b26');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  state.stars.forEach((star) => {
    ctx.fillStyle = `rgba(190, 246, 255, ${0.25 + star.z * 0.5})`;
    ctx.fillRect(star.x, star.y, Math.max(1, star.z * 2), Math.max(1, star.z * 2));
  });

  ctx.strokeStyle = 'rgba(92, 244, 255, 0.2)';
  ctx.beginPath();
  ctx.moveTo(0, height - PLAYFIELD.dangerZoneOffset);
  ctx.lineTo(width, height - PLAYFIELD.dangerZoneOffset);
  ctx.stroke();

  if (state.boss) drawEnemy(ctx, state.boss, state.activeTargetId === state.boss.id);
  state.drones.forEach((drone) => drawEnemy(ctx, drone, state.activeTargetId === drone.id));
  state.enemies.forEach((enemy) => drawEnemy(ctx, enemy, state.activeTargetId === enemy.id));

  state.projectiles.forEach((p) => {
    ctx.strokeStyle = '#62f9ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#62f9ff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(p.fromX, p.fromY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });

  state.particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    ctx.globalAlpha = 1;
  });

  state.scorePopups.forEach((popup) => {
    ctx.globalAlpha = Math.max(0, popup.life);
    ctx.fillStyle = '#f8fdff';
    ctx.font = '700 16px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(popup.text, popup.x, popup.y);
    ctx.globalAlpha = 1;
  });

  const cannon = state.player;
  ctx.save();
  ctx.translate(cannon.x, cannon.y);
  ctx.fillStyle = '#38e8ff';
  ctx.shadowColor = '#38e8ff';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.lineTo(24, 22);
  ctx.lineTo(-24, 22);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#9af8ff';
  ctx.fillRect(-5, -44, 10, 32);
  ctx.restore();

  if (state.status === 'countdown' || state.status === 'wave-complete') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#f8fdff';
    ctx.font = '800 44px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    const text = state.status === 'countdown' ? Math.max(1, Math.ceil(state.countdownMs / 600)) : 'Wave Complete';
    ctx.fillText(text, width / 2, height / 2);
  }
  ctx.restore();
}

export default function GameCanvas({ settings, onSettingsChange, highScore, audio, onGameOver, onQuit }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const stateRef = useRef(null);
  const frameRef = useRef(0);
  const lastRef = useRef(0);
  const [hud, setHud] = useState(null);
  const [paused, setPaused] = useState(false);
  const [showPauseSettings, setShowPauseSettings] = useState(false);

  useEffect(() => {
    if (stateRef.current) stateRef.current.settings = settings;
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext('2d');
    function syncSize() {
      const rect = wrap.getBoundingClientRect();
      const width = Math.max(320, rect.width || window.innerWidth);
      const height = Math.max(320, rect.height || window.innerHeight - 58);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (stateRef.current) resizeState(stateRef.current, width, height);
      else stateRef.current = createInitialGameState({ width, height, highScore, settings });
    }
    syncSize();
    const observer = new ResizeObserver(syncSize);
    observer.observe(wrap);
    window.addEventListener('resize', syncSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncSize);
    };
  }, [highScore, settings]);

  useEffect(() => {
    function onKeyDown(event) {
      const state = stateRef.current;
      if (!state) return;
      if (event.key === 'Escape') {
        if (state.status === 'paused') {
          state.status = 'playing';
          setPaused(false);
          setShowPauseSettings(false);
        } else if (state.status === 'playing' || state.status === 'countdown') {
          state.status = 'paused';
          setPaused(true);
        }
        return;
      }
      if (state.status !== 'playing') return;
      const key = event.key.toLowerCase();
      if (/^[a-z]$/.test(key)) {
        event.preventDefault();
        processLetter(state, key, audio);
        setHud(currentStats(state));
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [audio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    function tick(now) {
      const state = stateRef.current;
      const last = lastRef.current || now;
      lastRef.current = now;
      if (state) {
        updateGame(state, now - last, audio);
        render(ctx, state);
        const stats = currentStats(state);
        setHud(stats);
        if (state.status === 'game-over') {
          cancelAnimationFrame(frameRef.current);
          onGameOver(stats);
          return;
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [audio, onGameOver]);

  function resume() {
    if (stateRef.current) stateRef.current.status = 'playing';
    setPaused(false);
    setShowPauseSettings(false);
    audio.play('click');
  }

  function pause() {
    if (!stateRef.current || stateRef.current.status === 'game-over') return;
    stateRef.current.status = 'paused';
    setPaused(true);
    setShowPauseSettings(false);
    audio.play('click');
  }

  function quit() {
    audio.play('click');
    onQuit();
  }

  function patchSettings(patch) {
    audio.play('click');
    onSettingsChange(patch);
  }

  return (
    <section className="game-screen">
      <div className="hud">
        <div className="health"><span style={{ width: `${hud ? hud.health : 100}%` }} /></div>
        <span>Score <b>{hud?.score ?? 0}</b></span>
        <span>High <b>{hud?.highScore ?? highScore}</b></span>
        <span>Wave <b>{hud?.wave ?? 1}</b></span>
        <span>Acc <b>{hud ? percent(hud.accuracy) : '100%'}</b></span>
        <span>WPM <b>{hud?.wpm ?? 0}</b></span>
        <span>Combo <b>{hud ? hud.comboMultiplier.toFixed(1) : '1.0'}x</b></span>
        <span>KOs <b>{hud?.enemiesDefeated ?? 0}</b></span>
        <span>Boss <b>{hud?.bossesDefeated ?? 0}</b></span>
        <button className="hud-button" onClick={pause}>Pause</button>
      </div>
      {stateRef.current?.boss && (
        <div className="boss-bar"><span style={{ width: `${(stateRef.current.boss.health / stateRef.current.boss.maxHealth) * 100}%` }} /></div>
      )}
      <div className="canvas-wrap" ref={wrapRef}>
        <canvas ref={canvasRef} />
      </div>
      <div className="ad-strip" aria-label="Advertisement">
        <AdBanner />
      </div>
      {paused && (
        <div className="pause-overlay">
          <div className="pause-panel">
            <h2>Paused</h2>
            {!showPauseSettings ? (
              <div className="pause-actions">
                <button className="primary" onClick={resume}>Continue</button>
                <button onClick={() => setShowPauseSettings(true)}>Settings</button>
                <button onClick={quit}>Quit</button>
              </div>
            ) : (
              <div className="pause-settings">
                <label className="switch-row">
                  <span>Sound</span>
                  <input type="checkbox" checked={settings.soundEnabled} onChange={(e) => patchSettings({ soundEnabled: e.target.checked })} />
                </label>
                <label>
                  <span>Volume</span>
                  <input type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={(e) => onSettingsChange({ volume: Number(e.target.value) })} />
                </label>
                <label className="switch-row">
                  <span>Screen shake</span>
                  <input type="checkbox" checked={settings.screenShake} onChange={(e) => patchSettings({ screenShake: e.target.checked })} />
                </label>
                <label className="switch-row">
                  <span>Reduced motion</span>
                  <input type="checkbox" checked={settings.reducedMotion} onChange={(e) => patchSettings({ reducedMotion: e.target.checked })} />
                </label>
                <div className="difficulty">
                  {['easy', 'normal', 'arcade'].map((level) => (
                    <button key={level} className={settings.difficulty === level ? 'active' : ''} onClick={() => patchSettings({ difficulty: level })}>
                      {level}
                    </button>
                  ))}
                </div>
                <div className="pause-actions">
                  <button onClick={() => setShowPauseSettings(false)}>Back</button>
                  <button className="primary" onClick={resume}>Continue</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
