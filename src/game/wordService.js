import { WORD_BANKS, ALL_WORDS } from '../data/words.js';
import { loadDictionaryCache, saveDictionaryCache } from './storage.js';
import { pick } from './math.js';

const LETTERS_ONLY = /^[a-z]+$/;

export function isValidLocalWord(word) {
  return typeof word === 'string' && LETTERS_ONLY.test(word);
}

export function filterWordsByLength(words, min, max) {
  return words.filter((word) => isValidLocalWord(word) && word.length >= min && word.length <= max);
}

export function bankForRange(min, max) {
  if (max <= 4) return WORD_BANKS.short;
  if (max <= 6) return WORD_BANKS.common;
  if (max <= 8) return WORD_BANKS.medium;
  if (min >= 10) return WORD_BANKS.boss;
  return ALL_WORDS;
}

export function chooseWord({ min = 3, max = 6, avoidStarts = new Set(), boss = false } = {}) {
  const source = boss ? WORD_BANKS.boss : bankForRange(min, max);
  const candidates = filterWordsByLength(source, min, max);
  const uniqueStart = candidates.filter((word) => !avoidStarts.has(word[0]));
  return pick(uniqueStart.length ? uniqueStart : candidates);
}

export async function validateWordWithDictionary(word, { timeoutMs = 1200 } = {}) {
  const clean = String(word || '').toLowerCase();
  if (!isValidLocalWord(clean)) return false;
  const cache = loadDictionaryCache();
  if (Object.prototype.hasOwnProperty.call(cache, clean)) return cache[clean];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${clean}`, { signal: controller.signal });
    const valid = response.ok;
    cache[clean] = valid;
    saveDictionaryCache(cache);
    return valid;
  } catch {
    return true;
  } finally {
    clearTimeout(timeout);
  }
}
