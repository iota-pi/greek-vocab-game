import { conjugateVerb } from './conjugater';
import { VerbPerson, VerbTense, WordNumber } from './types';

describe('conjugateVerb', () => {
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
    ['εἰμι', 'second', 'singular', 'εἶ'],
    ['εἰμι', 'first', 'plural', 'ἐσμεν'],
  ])('%s, %s, %s, %s = "%s"', (verb, person, number, expected) => {
    const result = conjugateVerb({
      number,
      person,
      tense: 'present',
      verb,
    });
    expect(result).toEqual(expected);
  });

  it.each<[string, VerbTense, VerbPerson, WordNumber, string]>([
    ['λυω', 'imperfect', 'first', 'singular', 'ἐλυον'],
    ['λυω', 'imperfect', 'second', 'singular', 'ἐλυες'],
    ['λυω', 'aorist', 'third', 'singular', 'ἐλυσεν'],
    ['ἐσθιω', 'imperfect', 'first', 'plural', 'ἠσθιομεν'],
    ['εὑρισκω', 'aorist', 'second', 'plural', 'ηὑρισξατε'],
    ['ἐχω', 'imperfect', 'third', 'plural', 'εἰχον'],
    ['ἐχω', 'aorist', 'third', 'plural', 'εἰξαν'],
    ['ποιεω', 'imperfect', 'first', 'singular', 'ἐποιουν'],
    ['ποιεω', 'aorist', 'first', 'plural', 'ἐποιησαμεν'],
    ['καλεω', 'aorist', 'first', 'singular', 'ἐκαλεσα'],
    ['ἀκολoυθεω', 'imperfect', 'first', 'plural', 'ἠκολoυθουμεν'],
    ['εἰμι', 'imperfect', 'first', 'singular', 'ἠμεν'],
    ['παρακαλεω', 'imperfect', 'first', 'singular', 'παρεκαλουν'],
    ['διακονεω', 'imperfect', 'first', 'plural', 'διηκονουμεν'],
    ['ὑπαγω', 'imperfect', 'second', 'singular', 'ὑπηγες'],
  ])('%s, %s, %s, %s = "%s"', (verb, tense, person, number, expected) => {
    const result = conjugateVerb({
      number,
      person,
      tense,
      verb,
    });
    expect(result).toEqual(expected);
  });
});
