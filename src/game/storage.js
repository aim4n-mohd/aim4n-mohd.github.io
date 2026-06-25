import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants.js';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function loadSettings() {
  return { ...DEFAULT_SETTINGS, ...readJson(STORAGE_KEYS.settings, {}) };
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function loadHighScore() {
  return Number(localStorage.getItem(STORAGE_KEYS.highScore) || 0);
}

export function saveHighScore(score) {
  const next = Math.max(loadHighScore(), Math.floor(score));
  localStorage.setItem(STORAGE_KEYS.highScore, String(next));
  return next;
}

export function loadDictionaryCache() {
  return readJson(STORAGE_KEYS.dictionaryCache, {});
}

export function saveDictionaryCache(cache) {
  localStorage.setItem(STORAGE_KEYS.dictionaryCache, JSON.stringify(cache));
}
