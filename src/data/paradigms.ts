import { NounCase, WordNumber } from '../types';

type ParadigmPattern = Record<WordNumber, Record<NounCase, string>>;
export type Paradigm = {
  example: string,
  pattern: ParadigmPattern,
  ending: NounEnding,
};
export type NounEnding = 'ος' | 'η' | 'α' | 'ον';
export type ParadigmName = 'ος-ου' | 'η-ης' | 'α-ης' | 'α-ας' | 'ον-ου';

const paradigms: Record<ParadigmName, Paradigm> = {
  'ος-ου': {
    example: 'λογος',
    pattern: {
      singular: {
        n: 'ος',
        g: 'ου',
        d: 'ῳ',
        a: 'ον',
      },
      plural: {
        n: 'οι',
        g: 'ων',
        d: 'οις',
        a: 'ους',
      },
    },
    ending: 'ος',
  },
  'η-ης': {
    example: 'γραφη',
    pattern: {
      singular: {
        n: 'η',
        g: 'ης',
        d: 'ῃ',
        a: 'ην',
      },
      plural: {
        n: 'αι',
        g: 'ων',
        d: 'αις',
        a: 'ας',
      },
    },
    ending: 'η',
  },
  'α-ης': {
    example: 'δοξα',
    pattern: {
      singular: {
        n: 'α',
        g: 'ης',
        d: 'ῃ',
        a: 'αν',
      },
      plural: {
        n: 'αι',
        g: 'ων',
        d: 'αις',
        a: 'ας',
      },
    },
    ending: 'α',
  },
  'α-ας': {
    example: 'ὡρα',
    pattern: {
      singular: {
        n: 'α',
        g: 'ας',
        d: 'ᾳ',
        a: 'αν',
      },
      plural: {
        n: 'αι',
        g: 'ων',
        d: 'αις',
        a: 'ας',
      },
    },
    ending: 'α',
  },
  'ον-ου': {
    example: 'ἐργον',
    pattern: {
      singular: {
        n: 'ον',
        g: 'ου',
        d: 'ῳ',
        a: 'ον',
      },
      plural: {
        n: 'α',
        g: 'ων',
        d: 'οις',
        a: 'α',
      },
    },
    ending: 'ον',
  },
};

export default paradigms;
