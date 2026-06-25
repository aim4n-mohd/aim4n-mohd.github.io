import { describe, expect, it } from 'vitest';
import { chooseWord, filterWordsByLength, isValidLocalWord } from '../game/wordService.js';

describe('word service', () => {
  it('filters by length and letters only', () => {
    expect(filterWordsByLength(['cat', 'alpha', 'bad1', 'too-long'], 3, 5)).toEqual(['cat', 'alpha']);
    expect(isValidLocalWord('laser')).toBe(true);
    expect(isValidLocalWord('laser!')).toBe(false);
  });

  it('avoids duplicate first letters where possible', () => {
    const word = chooseWord({ min: 2, max: 4, avoidStarts: new Set(['a', 'b', 'c']) });
    expect(['a', 'b', 'c']).not.toContain(word[0]);
  });
});
