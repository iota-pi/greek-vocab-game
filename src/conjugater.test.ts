import { ConjugateVerbParams, checkConjugation, conjugateVerb, getConjugatedVerb } from './conjugater';
import { VerbMood, VerbPerson, VerbTense, VerbVoice, WordNumber } from './types';

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
      voice: 'active',
      mood: 'indicative',
      verb,
    });
    expect(result).toEqual(expected);
  });

  it.each<[string, VerbTense, VerbVoice, VerbMood, VerbPerson, WordNumber, string | null]>([
    ['λυω', 'imperfect', 'active', 'indicative', 'first', 'singular', 'ἐλυον'],
    ['λυω', 'imperfect', 'active', 'indicative', 'second', 'singular', 'ἐλυες'],
    ['λυω', 'aorist', 'active', 'indicative', 'third', 'singular', 'ἐλυσεν'],
    ['ἐσθιω', 'imperfect', 'active', 'indicative', 'first', 'plural', 'ἠσθιομεν'],
    ['εὑρισκω', 'aorist', 'active', 'indicative', 'second', 'plural', 'ηὑρισξατε'],
    ['ἐχω', 'imperfect', 'active', 'indicative', 'third', 'plural', 'εἰχον'],
    ['ἐχω', 'aorist', 'active', 'indicative', 'third', 'plural', 'εἰξαν'],
    ['ποιεω', 'imperfect', 'active', 'indicative', 'first', 'singular', 'ἐποιουν'],
    ['ποιεω', 'aorist', 'active', 'indicative', 'first', 'plural', 'ἐποιησαμεν'],
    ['καλεω', 'aorist', 'active', 'indicative', 'first', 'singular', 'ἐκαλεσα'],
    ['ἀκολoυθεω', 'imperfect', 'active', 'indicative', 'first', 'plural', 'ἠκολoυθουμεν'],
    ['εἰμι', 'imperfect', 'active', 'indicative', 'first', 'singular', 'ἠμην'],
    ['παρακαλεω', 'imperfect', 'active', 'indicative', 'first', 'singular', 'παρεκαλουν'],
    ['διακονεω', 'imperfect', 'active', 'indicative', 'first', 'plural', 'διηκονουμεν'],
    ['ὑπαγω', 'imperfect', 'active', 'indicative', 'second', 'singular', 'ὑπηγες'],
    ['λυω', 'present', 'active', 'imperative', 'first', 'singular', null],
    ['λυω', 'present', 'active', 'imperative', 'second', 'singular', 'λυε'],
    ['ὑπαγω', 'aorist', 'middle', 'imperative', 'third', 'plural', 'ὑπαξασθωσαν'],
    ['λυω', 'aorist', 'active', 'infinitive', 'first', 'plural', 'λυσαι'],
    ['λυω', 'aorist', 'middle', 'infinitive', 'first', 'plural', 'λυσασθαι'],
    ['λυω', 'future', 'middle', 'infinitive', 'first', 'plural', null],
    ['φωνεω', 'present', 'middle', 'imperative', 'second', 'singular', 'φωνου'],
    ['εἰμι', 'present', 'active', 'imperative', 'first', 'singular', null],
  ])('%s, %s, %s, %s, %s, %s = "%s"', (verb, tense, voice, mood, person, number, expected) => {
    const result = conjugateVerb({
      mood,
      number,
      person,
      tense,
      verb,
      voice,
    });
    expect(result).toEqual(expected);
  });

  it.each<[string, VerbTense, VerbVoice, VerbMood, VerbPerson, WordNumber, string]>([
    ['εἰμι', 'imperfect', 'active', 'indicative', 'second', 'singular', 'ἠς'],
    ['εἰμι', 'imperfect', 'active', 'indicative', 'second', 'singular', 'ἠσθα'],
    ['εἰμι', 'imperfect', 'active', 'indicative', 'first', 'plural', 'ἠμεν'],
    ['εἰμι', 'imperfect', 'active', 'indicative', 'first', 'plural', 'ἠμεθα'],
  ])('%s, %s, %s, %s, %s, %s matches "%s"', (verb, tense, voice, mood, person, number, test) => {
    const result = checkConjugation(
      test,
      {
        mood,
        number,
        person,
        tense,
        verb,
        voice,
      },
    );
    expect(result).toEqual(true);
  });
});
