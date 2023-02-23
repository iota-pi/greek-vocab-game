import { conjugateVerb } from './conjugater';
import { VerbPerson, WordNumber } from './types';

describe('declineNoun', () => {
  it.each<[string, VerbPerson, WordNumber, string]>([
    ['λυω', 'first', 'singular', 'λυω'],
    ['λυω', 'second', 'singular', 'λυεις'],
    ['λυω', 'third', 'singular', 'λυει'],
    ['ἐσθιω', 'first', 'plural', 'ἐσθιομεν'],
    ['εὑρισκω', 'second', 'plural', 'εὑρισκετε'],
    ['ἐχω', 'third', 'plural', 'ἐχουσιν'],
    ['ποιεω', 'first', 'singular', 'ποιω'],
    ['ποιεω', 'first', 'plural', 'ποιουμεν'],
    ['εἰμι', 'first', 'singular', 'εἰμι'],
    ['εἰμι', 'second', 'singular', 'ε̂ἰ'],
    ['εἰμι', 'first', 'plural', 'ἐσμεν'],
  ])('declineNoun(%s, %s, %s) = "%s"', (verb, person, number, expected) => {
    const result = conjugateVerb({
      verb,
      person,
      number,
    });
    expect(result).toEqual(expected);
  });
});
