import { conjugateVerb } from './conjugater';
import { declineNoun, getGender } from './decliner';
import type { Noun, Parsing, Verb, Word, WordData, WordNumber, WordWithParsing } from './types';

export const CATEGORY_MAP = {
  noun: 'Nouns',
  verb: 'Verbs',
};
export type StudyCategory = keyof typeof CATEGORY_MAP;

export const ALL_CASES: Noun.Case[] = ['n', 'g', 'd', 'a'];
export const ALL_GENDERS: Noun.Gender[] = ['masculine', 'feminine', 'neuter'];
export const ALL_NUMBERS: WordNumber[] = ['singular', 'plural'];
export const ALL_PERSONS: Verb.Person[] = ['first', 'second', 'third'];
export const ALL_MOODS: Verb.Mood[] = [
  'indicative',
  'imperative',
  'infinitive',
  'subjunctive',
  'participle',
];
export const ALL_TENSES: Verb.Tense[] = ['present', 'imperfect', 'aorist', 'future'];
export const ALL_VOICES: Verb.Voice[] = ['active', 'middle', 'passive'];

export const API_ENDPOINT = (
  'https://s46ipfbb5e.execute-api.ap-southeast-2.amazonaws.com/production'
);

export function isNoun(word: Word<WordData>): word is Word<Noun.Data>;
export function isNoun(word: WordWithParsing<WordData>): word is WordWithParsing<Noun.Data>;
export function isNoun(word: Word<WordData> | WordWithParsing<WordData>) {
  if ('data' in word) {
    return word.data.type === 'noun';
  }
  return word.type === 'noun';
}

export function isVerb(word: Word<WordData>): word is Word<Verb.Data>;
export function isVerb(word: WordWithParsing<WordData>): word is WordWithParsing<Verb.Data>;
export function isVerb(word: Word<WordData> | WordWithParsing<WordData>) {
  if ('data' in word) {
    return word.data.type === 'verb';
  }
  return word.type === 'verb';
}

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

export function checkParsing<T extends WordData>(
  parsing: WordWithParsing<T>,
  answer: string,
) {
  if (isNoun(parsing)) {
    const declined = declineNoun({ noun: parsing.data, ...parsing.parsing });
    return declined === answer;
  } else if (isVerb(parsing)) {
    const conjugated = conjugateVerb({ verb: parsing.data, ...parsing.parsing });
    return conjugated === answer;
  }
  throw new Error('Unknown word type');
}

export type NounOptions = {
  noun: Noun.Data[],
  number: WordNumber[],
  nounCase: Noun.Case[],
};

export type VerbOptions = {
  verb: Verb.Data[],
  number: WordNumber[],
  tense: Verb.Tense[],
  mood: Verb.Mood[],
  voice: Verb.Voice[],
  person: Verb.Person[],
  nounCase: Noun.Case[],
  gender: Noun.Gender[],
};

export const getPickNoun = (
  options: NounOptions,
) => {
  const maxAttempts = 3;
  return () => {
    let result: WordWithParsing<Noun.Data> | null = null;
    for (let i = 0; i < maxAttempts; ++i) {
      let params = Object.fromEntries(
        Object.entries(options).map(
          ([label, choices]) => (
            [label, choices[Math.floor(Math.random() * choices.length)]]
          ),
        ),
      ) as {
        [P in keyof NounOptions]: NounOptions[P][0];
      };
      if (params.noun.singular) {
        params.number = 'singular';
      }
      const gender = getGender(params.noun.word);
      try {
        const word = declineNoun(params);
        result = {
          word,
          data: params.noun,
          parsing: {
            nounCase: params.nounCase,
            number: params.number,
            gender,
          },
        };
        break;
      } catch (error) {
        console.warn(
          'Error while declining word '
          + `${params.noun.word} ${params.nounCase} ${params.number}`,
        );
      }
    }

    if (result) {
      return result;
    }
    throw new Error(
      `Could not pick a valid word after ${maxAttempts} attempts`
    );
  };
}

export const getPickVerb = (
  options: VerbOptions,
) => {
  const maxAttempts = 10;
  return () => {
    let result: WordWithParsing<Verb.Data> | null = null;
    for (let i = 0; i < maxAttempts; ++i) {
      let params = Object.fromEntries(
        Object.entries(options).map(
          ([label, choices]) => (
            [label, choices[Math.floor(Math.random() * choices.length)]]
          ),
        ),
      ) as {
        [P in keyof VerbOptions]: VerbOptions[P][0];
      };

      const validTenses = options.tense.filter(t => !params.verb.omit?.includes(t));
      params.tense = validTenses[Math.floor(Math.random() * validTenses.length)];

      try {
        const word = conjugateVerb(params);

        if (word !== null) {
          result = {
            word,
            data: params.verb,
            parsing: {
              mood: params.mood,
              number: params.number,
              person: params.person,
              tense: params.tense,
              voice: params.voice,
              nounCase: params.nounCase,
              gender: params.gender,
            },
          };
          break;
        }
      } catch (error) {
        console.warn(
          `Error while conjugating word ${params}`,
        );
      }
    }

    if (result) {
      return result;
    }
    throw new Error(
      `Could not pick a valid word after ${maxAttempts} attempts`
    );
  };
}
