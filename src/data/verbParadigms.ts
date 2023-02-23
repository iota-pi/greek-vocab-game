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
export type VerbEnding = 'ω' | 'εω';

const paradigms: Record<VerbEnding, Paradigm> = {
  'ω': {
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
  'εω': {
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
};

export default paradigms;
