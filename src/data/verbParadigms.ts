import { VerbPerson } from '../types';

type ParadigmPattern = {
  singular: Record<VerbPerson, string>,
  plural: Record<VerbPerson, string>,
};
export type Paradigm = {
  example: string,
  pattern: ParadigmPattern,
  ending: VerbEnding,
};
export type VerbEnding = 'ω' | 'εω' | 'εἰμι';

const paradigms: Record<VerbEnding, Paradigm> = {
  ω: {
    example: 'λυω',
    pattern: {
      singular: {
        first: 'ω',
        second: 'εις',
        third: 'ει',
      },
      plural: {
        first: 'ομεν',
        second: 'ετε',
        third: 'ουσιν',
      },
    },
    ending: 'ω',
  },
  εω: {
    example: 'ποιεω',
    pattern: {
      singular: {
        first: 'ω',
        second: 'εις',
        third: 'ει',
      },
      plural: {
        first: 'ουμεν',
        second: 'ειτε',
        third: 'ουσιν',
      },
    },
    ending: 'εω',
  },
  'εἰμι': {
    example: 'εἰμι',
    pattern: {
      singular: {
        first: 'εἰμι',
        second: 'ε̂ἰ',
        third: 'ἐστιν',
      },
      plural: {
        first: 'ἐσμεν',
        second: 'ἐστε',
        third: 'εἰσιν',
      },
    },
    ending: 'εἰμι',
  },
};

export default paradigms;
