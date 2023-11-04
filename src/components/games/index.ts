import type { Noun, Verb, WordNumber, WordWithParsing } from '../../types';
import { declineNoun, getGender } from '../../decliner';
import { conjugateVerb } from '../../conjugater';

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
