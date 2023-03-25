import { VerbTenseParadigms } from '../types';

export type Paradigm = {
  example: string,
  tenses: VerbTenseParadigms,
  ending: VerbEnding,
};
export type VerbEnding = 'ω' | 'εω';

const paradigms: Record<VerbEnding, Paradigm> = {
  ω: {
    example: 'λυω',
    tenses: {
      present: {
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
      imperfect: {
        singular: {
          first: 'ον',
          second: 'ες',
          third: 'εν',
        },
        plural: {
          first: 'ομεν',
          second: 'ετε',
          third: 'ον',
        },
      },
      aorist: {
        singular: {
          first: 'σα',
          second: 'σας',
          third: 'σεν',
        },
        plural: {
          first: 'σαμεν',
          second: 'σατε',
          third: 'σαν',
        },
      },
      future: {
        singular: {
          first: 'σω',
          second: 'σεις',
          third: 'σει',
        },
        plural: {
          first: 'σομεν',
          second: 'σετε',
          third: 'σουσιν',
        },
      },
    },
    ending: 'ω',
  },
  εω: {
    example: 'ποιεω',
    tenses: {
      present: {
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
      imperfect: {
        singular: {
          first: 'ουν',
          second: 'εις',
          third: 'ει',
        },
        plural: {
          first: 'ουμεν',
          second: 'ειτε',
          third: 'ουν',
        },
      },
      aorist: {
        singular: {
          first: 'ησα',
          second: 'ησας',
          third: 'ησεν',
        },
        plural: {
          first: 'ησαμεν',
          second: 'ησατε',
          third: 'ησαν',
        },
      },
      future: {
        singular: {
          first: 'ησω',
          second: 'ησεις',
          third: 'ησει',
        },
        plural: {
          first: 'ησομεν',
          second: 'ησετε',
          third: 'ησουσιν',
        },
      },
    },
    ending: 'εω',
  },
};

export default paradigms;
