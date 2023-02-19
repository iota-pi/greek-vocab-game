import { Gender, NounCase, WordNumber } from './types';

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

export function getCaseName(nounCase: NounCase) {
  const mapping: Record<NounCase, string> = {
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

export function getGenderName(gender: Gender) {
  const mapping: Record<Gender, string> = {
    masculine: 'Masculine',
    feminine: 'Feminine',
    neuter: 'Neuter',
  };
  return mapping[gender];
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
