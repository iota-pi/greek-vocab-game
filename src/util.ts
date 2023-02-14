import { Gender, NounCase, WordNumber } from "./types";

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
