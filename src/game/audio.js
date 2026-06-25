export class GameAudio {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
  }

  setSettings(settings) {
    this.settings = settings;
  }

  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  play(name) {
    if (!this.settings.soundEnabled || typeof window === 'undefined') return;
    this.ensure();
    const map = {
      laser: [760, 0.045, 'square'],
      destroy: [180, 0.14, 'sawtooth'],
      damage: [90, 0.18, 'triangle'],
      shieldBreak: [420, 0.24, 'sine'],
      bossDefeated: [120, 0.45, 'sawtooth'],
      gameOver: [70, 0.55, 'triangle'],
      click: [560, 0.055, 'sine']
    };
    const [freq, duration, type] = map[name] || map.click;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (name === 'laser') osc.frequency.exponentialRampToValueAtTime(freq * 1.7, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.settings.volume * 0.18), now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }
}
