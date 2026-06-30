import { useEffect, useMemo, useState } from 'react';
import GameCanvas from './game/GameCanvas.jsx';
import { loadHighScore, loadSettings, saveHighScore, saveSettings } from './game/storage.js';
import { GameAudio } from './game/audio.js';

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [settings, setSettings] = useState(() => loadSettings());
  const [highScore, setHighScore] = useState(() => loadHighScore());
  const [finalStats, setFinalStats] = useState(null);
  const audio = useMemo(() => new GameAudio(settings), []);

  useEffect(() => {
    saveSettings(settings);
    audio.setSettings(settings);
  }, [settings, audio]);

  function patchSettings(patch) {
    setSettings((current) => ({ ...current, ...patch }));
  }

  function startGame() {
    audio.play('click');
    setFinalStats(null);
    setScreen('game');
  }

  function handleGameOver(stats) {
    const nextHigh = saveHighScore(stats.score);
    setHighScore(nextHigh);
    setFinalStats({ ...stats, highScore: nextHigh });
    setScreen('game-over');
  }

  function goMenu() {
    audio.play('click');
    setScreen('menu');
  }

  return (
    <main className="app-shell">
      {screen === 'menu' && (
        <section className="menu-screen">
          <div className="brand-block">
            <p className="eyebrow">Retro typing defense</p>
            <h1>TypeBlaster</h1>
            <p className="tagline">Lock onto descending words, carve them down with lasers, and survive boss waves.</p>
          </div>

          <div className="menu-grid">
            <section className="panel how">
              <h2>How to Play</h2>
              <ul>
                <li>Type words to shoot.</li>
                <li>Orange means locked target.</li>
                <li>Finish the word to destroy it.</li>
                <li>Boss waves appear every 3rd wave.</li>
                <li>Destroy drones before the boss.</li>
                <li>Protect the cannon.</li>
              </ul>
            </section>

            <section className="panel settings">
              <h2>Settings</h2>
              <label className="switch-row">
                <span>Sound</span>
                <input type="checkbox" checked={settings.soundEnabled} onChange={(e) => patchSettings({ soundEnabled: e.target.checked })} />
              </label>
              <label>
                <span>Volume</span>
                <input type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={(e) => patchSettings({ volume: Number(e.target.value) })} />
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
            </section>
          </div>

          <div className="menu-actions">
            <button className="primary" onClick={startGame}>Start Game</button>
            <div className="high-score">High Score <strong>{highScore}</strong></div>
          </div>
        </section>
      )}

      {screen === 'game' && (
        <GameCanvas
          settings={settings}
          onSettingsChange={patchSettings}
          highScore={highScore}
          audio={audio}
          onQuit={goMenu}
          onGameOver={handleGameOver}
        />
      )}

      {screen === 'game-over' && finalStats && (
        <section className="game-over-screen">
          <h1>Game Over</h1>
          <div className="final-score">{finalStats.score}</div>
          <div className="stats-grid">
            <span>High Score <b>{finalStats.highScore}</b></span>
            <span>Survival <b>{formatTime(finalStats.survivalMs)}</b></span>
            <span>WPM <b>{finalStats.wpm}</b></span>
            <span>Accuracy <b>{Math.round(finalStats.accuracy * 100)}%</b></span>
            <span>Enemies <b>{finalStats.enemiesDefeated}</b></span>
            <span>Bosses <b>{finalStats.bossesDefeated}</b></span>
            <span>Wave <b>{finalStats.wave}</b></span>
          </div>
          <div className="menu-actions">
            <button className="primary" onClick={startGame}>Restart</button>
            <button onClick={goMenu}>Back to Menu</button>
          </div>
        </section>
      )}
    </main>
  );
}
