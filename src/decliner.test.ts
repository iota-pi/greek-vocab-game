import { declineNoun, getNounData } from './decliner';
import { Noun, WordNumber } from './types';

describe('declineNoun', () => {
  it.each<[string, Noun.Case, WordNumber, string]>([
    ['λογος', 'd', 'singular', 'λογῳ'],
    ['λογος', 'g', 'plural', 'λογων'],
    ['λογος', 'a', 'plural', 'λογους'],
    ['γραφη', 'g', 'singular', 'γραφης'],
    ['γραφη', 'd', 'singular', 'γραφῃ'],
    ['γραφη', 'a', 'singular', 'γραφην'],
    ['γραφη', 'n', 'plural', 'γραφαι'],
    ['ἐργον', 'n', 'singular', 'ἐργον'],
    ['ἐργον', 'a', 'singular', 'ἐργον'],
    ['ἐργον', 'a', 'plural', 'ἐργα'],
    ['ὡρα', 'd', 'singular', 'ὡρᾳ'],
    ['δοξα', 'd', 'singular', 'δοξῃ'],
  ])('declineNoun(%s, %s, %s) = "%s"', (noun, nounCase, number, expected) => {
    const result = declineNoun({
      noun: getNounData(noun),
      nounCase,
      number,
    });
    expect(result).toEqual(expected);
  });
});
