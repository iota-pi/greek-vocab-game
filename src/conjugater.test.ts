import { checkConjugation, conjugateVerb, getVerbData } from './conjugater';
import { Verb, WordNumber } from './types';

describe('conjugateVerb', () => {
  it.each<[string, Verb.Person, WordNumber, string]>([
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
      verb: getVerbData(verb),
    });
    expect(result).toEqual(expected);
  });

  it.each<[string, Verb.Tense, Verb.Voice, Verb.Mood, Verb.Person, WordNumber, string | null]>([
    ['λυω', 'imperfect', 'active', 'indicative', 'first', 'singular', 'ἐλυον'],
    ['λυω', 'imperfect', 'active', 'indicative', 'second', 'singular', 'ἐλυες'],
    ['λυω', 'aorist', 'active', 'indicative', 'third', 'singular', 'ἐλυσεν'],
    ['ἐσθιω', 'imperfect', 'active', 'indicative', 'first', 'plural', 'ἠσθιομεν'],
    ['εὑρισκω', 'aorist', 'active', 'indicative', 'second', 'plural', 'ηὑρισξατε'],
    ['ἐχω', 'imperfect', 'active', 'indicative', 'third', 'plural', 'εἰχον'],
    ['ἐχω', 'aorist', 'active', 'indicative', 'third', 'plural', 'εσχον'],
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
    ['ὑπαγω', 'aorist', 'active', 'indicative', 'second', 'singular', 'ὑπηγαγες'],
    ['ὑπαγω', 'aorist', 'passive', 'imperative', 'third', 'plural', 'ὑπηχθητωσαν'],
    ['λυω', 'aorist', 'active', 'infinitive', 'first', 'plural', 'λυσαι'],
    ['λυω', 'aorist', 'middle', 'infinitive', 'first', 'plural', 'λυσασθαι'],
    ['λυω', 'future', 'middle', 'infinitive', 'first', 'plural', null],
    ['φωνεω', 'present', 'middle', 'imperative', 'second', 'singular', 'φωνου'],
    ['εἰμι', 'present', 'active', 'imperative', 'first', 'singular', null],
    ['εἰμι', 'future', 'active', 'indicative', 'first', 'singular', 'ἐσομαι'],
    ['εἰμι', 'future', 'active', 'indicative', 'second', 'plural', 'ἐσεσθε'],
    ['ἀποστελλω', 'imperfect', 'active', 'indicative', 'first', 'singular', 'ἀπεστελλον'],
    ['ἐκβαλλω', 'imperfect', 'active', 'indicative', 'first', 'singular', 'ἐξεβαλλον'],
    ['λυω', 'future', 'passive', 'indicative', 'first', 'singular', 'λυθησομαι'],
    ['λυω', 'future', 'passive', 'indicative', 'third', 'plural', 'λυθησονται'],
    ['φωνεω', 'aorist', 'passive', 'indicative', 'second', 'singular', 'ἐφωνηθης'],
    ['φερω', 'future', 'active', 'indicative', 'second', 'singular', 'οἰσεις'],
    ['φερω', 'future', 'passive', 'indicative', 'second', 'singular', 'οἰθησῃ'],
    ['φερω', 'aorist', 'active', 'indicative', 'second', 'singular', 'ἠνεγκας'],
    ['σῳζω', 'aorist', 'passive', 'indicative', 'second', 'singular', 'ἐσωθης'],
    ['σῳζω', 'future', 'passive', 'indicative', 'second', 'singular', 'σωθησῃ'],
    ['λεγω', 'future', 'active', 'indicative', 'first', 'plural', 'ἐρουμεν'],
    ['ἐκβαλλω', 'aorist', 'passive', 'indicative', 'first', 'singular', 'ἐξεβληθην'],
    ['λεγω', 'aorist', 'passive', 'indicative', 'first', 'singular', 'ἐρρεθην'],
  ])('%s, %s, %s, %s, %s, %s = "%s"', (verb, tense, voice, mood, person, number, expected) => {
    const result = conjugateVerb({
      mood,
      number,
      person,
      tense,
      verb: getVerbData(verb),
      voice,
    });
    expect(result).toEqual(expected);
  });

  it.each<[string, Verb.Tense, Verb.Voice, Verb.Mood, Verb.Person, WordNumber, string]>([
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
        verb: getVerbData(verb),
        voice,
      },
    );
    expect(result).toEqual(true);
  });
});
