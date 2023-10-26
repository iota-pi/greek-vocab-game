import { Noun, Verb, WordNumber } from './types';

export const API_ENDPOINT = (
  'https://s46ipfbb5e.execute-api.ap-southeast-2.amazonaws.com/production'
);

export function capitalise(value: string) {
  if (value.toLowerCase() !== value && value.toUpperCase() !== value) {
    // Assume name is correctly capitalised
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function ensureDefined<T>(value: T | undefined): T {
  if (!isDefined(value)) {
    throw new Error('ensureDefined got undefined value');
  }
  return value;
}

export function normaliseColumnName(value: string) {
  const name = value.replace(/\s+/g, '');
  return name.toLowerCase();
}

export function getCaseName(nounCase: Noun.Case) {
  const mapping: Record<Noun.Case, string> = {
    n: 'Nominative',
    g: 'Genitive',
    d: 'Dative',
    a: 'Accusative',
  };
  return mapping[nounCase];
}

export function getNumberName(number: WordNumber) {
  const mapping: Record<WordNumber, string> = {
    singular: 'Singular',
    plural: 'Plural',
  };
  return mapping[number];
}

export function getPersonName(person: Verb.Person) {
  const mapping: Record<Verb.Person, string> = {
    first: 'First',
    second: 'Second',
    third: 'Third',
  };
  return mapping[person];
}

export function getGenderName(gender: Noun.Gender) {
  const mapping: Record<Noun.Gender, string> = {
    masculine: 'Masculine',
    feminine: 'Feminine',
    neuter: 'Neuter',
  };
  return mapping[gender];
}

export function getTenseName(tense: Verb.Tense) {
  const mapping: Record<Verb.Tense, string> = {
    aorist: 'Aorist',
    imperfect: 'Imperfect',
    present: 'Present',
    future: 'Future',
  };
  return mapping[tense];
}

export function getMoodName(mood: Verb.Mood) {
  const mapping: Record<Verb.Mood, string> = {
    imperative: 'Imperative',
    indicative: 'Indicative',
    infinitive: 'Infinitive',
    participle: 'Participle',
    subjunctive: 'Subjunctive',
  };
  return mapping[mood];
}

export function getVoiceName(voice: Verb.Voice) {
  const mapping: Record<Verb.Voice, string> = {
    active: 'Active',
    middle: 'Middle/Passive',
    passive: 'Passive',
  };
  return mapping[voice];
}

export function getShortVoiceName(voice: Verb.Voice) {
  const mapping: Record<Verb.Voice, string> = {
    active: 'Act',
    middle: 'M/P',
    passive: 'Pass',
  };
  return mapping[voice];
}

export function splitTime(time: number) {
  const ms = time % 1000;
  const s = Math.floor(time / 1000) % 60;
  const m = Math.floor(time / 1000 / 60);
  return { m, ms, s };
}

export function formatTime(time: { m: number, ms: number, s: number }) {
  const m = time.m.toString().padStart(2, '0');
  const s = time.s.toString().padStart(2, '0');
  const ms = Math.floor(time.ms / 10).toString().padStart(2, '0');
  return `${m}:${s}.${ms}`;
}

export function applyWeightings<T extends { weight?: number }>(data: T[]) {
  return data.flatMap(x => new Array<T>(x.weight ?? 1).fill(x));
}
