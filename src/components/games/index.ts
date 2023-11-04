import { FC } from 'react';
import type { WordData, GameCategory, GameComponentProps, Noun, Parsing, ParsingOptions, Verb, WordNumber, WordWithParsing } from '../../types';
import nouns from '../../data/nouns';
import { declineNoun, getGender } from '../../decliner';
import FirstAndSecondNouns from './FirstAndSecondNouns';
import { getCaseName, getGenderName, getNumberName, getPersonName, getTenseName, getVoiceName } from '../../util';
import IndicativeVerbs from './IndicativeVerbs';
import verbs from '../../data/verbs';
import { conjugateVerb } from '../../conjugater';
import ImperativeVerbs from './ImperativeVerbs';
import InfinitiveVerbs from './InfinitiveVerbs';
import PresentVerbs from './PresentVerbs';

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

export type GameData<T extends WordData> = {
  category: GameCategory,
  name: string,
  questions?: number,
  formatter: (form: Parsing<T>) => string,
  pickWord: () => WordWithParsing<T>,
  component: FC<GameComponentProps<T>>,
};

export const gameWordParams: (
  Record<GameCategory, ParsingOptions<Noun.Data> | ParsingOptions<Verb.Data>>
) = {
  firstAndSecondNouns: {
    nounCase: ['n', 'g', 'd', 'a'],
    number: ['singular', 'plural'],
    gender: ['masculine', 'feminine', 'neuter'],
  },
  indicative: {
    tense: ['present', 'imperfect', 'aorist', 'future'],
    mood: ['indicative'],
    voice: ['active'],
    person: ['first', 'second', 'third'],
    number: ['singular', 'plural'],
    nounCase: [],
    gender: [],
  },
  imperative: {
    // TODO: other tenses?
    tense: ['present', 'aorist'],
    mood: ['imperative'],
    voice: ['active', 'middle'],
    person: ['second', 'third'],
    number: ['singular', 'plural'],
    nounCase: [],
    gender: [],
  },
  infinitive: {
    // TODO: other tenses?
    tense: ['present', 'aorist'],
    mood: ['infinitive'],
    voice: ['active', 'middle'],
    person: ['first'],
    number: ['singular'],
    nounCase: [],
    gender: [],
  },
  verbs: {
    tense: ['present'],
    mood: ['indicative'],
    voice: ['active'],
    person: ['first', 'second', 'third'],
    number: ['singular', 'plural'],
    nounCase: [],
    gender: [],
  },
};

export const games: (
  Record<GameCategory, GameData<Noun.Data> | GameData<Verb.Data>>
) = {
  firstAndSecondNouns: {
    category: 'firstAndSecondNouns',
    component: FirstAndSecondNouns,
    formatter: (
      // TODO: move to separate formatters file
      (parsing: Noun.Parsing) => (
        [
          getCaseName(parsing.nounCase),
          getNumberName(parsing.number),
          getGenderName(parsing.gender),
        ].join(' ')
      )
    ),
    name: 'Nouns (1st & 2nd Declension)',
    pickWord: getPickNoun({
      noun: nouns,
      ...gameWordParams.firstAndSecondNouns as ParsingOptions<Noun.Data>,
    }),
    questions: 20,
  },
  indicative: {
    category: 'indicative',
    component: IndicativeVerbs,
    formatter: (
      (parsing: Verb.Parsing) => (
        [
          getTenseName(parsing.tense),
          getPersonName(parsing.person),
          getNumberName(parsing.number),
        ].join(' ')
      )
    ),
    name: 'Active Indicative Verbs',
    pickWord: getPickVerb({
      verb: verbs,
      ...gameWordParams.indicative as ParsingOptions<Verb.Data>,
    }),
  },
  imperative: {
    category: 'imperative',
    component: ImperativeVerbs,
    formatter: (
      (parsing: Verb.Parsing) => (
        [
          getTenseName(parsing.tense),
          getVoiceName(parsing.voice),
          getPersonName(parsing.person),
          getNumberName(parsing.number),
        ].join(' ')
      )
    ),
    name: 'Imperative Verbs',
    pickWord: getPickVerb({
      verb: verbs,
      ...gameWordParams.imperative as ParsingOptions<Verb.Data>,
    }),
  },
  infinitive: {
    category: 'infinitive',
    component: InfinitiveVerbs,
    formatter: (
      (parsing: Verb.Parsing) => (
        [
          getTenseName(parsing.tense),
          getVoiceName(parsing.voice),
        ].join(' ')
      )
    ),
    name: 'Infinitive Verbs',
    pickWord: getPickVerb({
      verb: verbs,
      ...gameWordParams.infinitive as ParsingOptions<Verb.Data>,
    }),
  },
  verbs: {
    category: 'verbs',
    component: PresentVerbs,
    formatter: (
      (parsing: Verb.Parsing) => (
        [
          getTenseName(parsing.tense),
          getVoiceName(parsing.voice),
        ].join(' ')
      )
    ),
    name: 'Present Active Indicative Verbs',
    pickWord: getPickVerb({
      verb: verbs,
      ...gameWordParams.verbs as ParsingOptions<Verb.Data>,
    }),
  },
};
