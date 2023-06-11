import { VerbMood, VerbParadigmPattern, VerbTense, VerbVoice } from '../types';

export type Paradigm = {
  paradigm: VerbParadigmPattern,
  ending: VerbEnding,
};
export type VerbEnding = (
  | 'ω'
  | 'ον'
  | 'ομαι'
  | 'α'
  | 'ομην'
  | 'αμην'
  | 'ε'
  | 'σον'
  | 'ου'
  | 'ειν'
  | 'αι'
  | 'εσθαι'
  | 'ασθαι'
  | 'ην'
  | 'ητι'
  | 'ηναι'
);

const paradigms: Record<VerbEnding, Paradigm | null> = {
  ω: {
    paradigm: {
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
  ον: {
    paradigm: {
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
    ending: 'ον',
  },
  α: {
    paradigm: {
      singular: {
        first: 'α',
        second: 'ας',
        third: 'εν',
      },
      plural: {
        first: 'αμεν',
        second: 'ατε',
        third: 'αν',
      },
    },
    ending: 'α',
  },
  ομαι: {
    paradigm: {
      singular: {
        first: 'ομαι',
        second: 'ῃ',
        third: 'εται',
      },
      plural: {
        first: 'ομεθα',
        second: 'εσθε',
        third: 'ονται',
      },
    },
    ending: 'ομαι',
  },
  ομην: {
    paradigm: {
      singular: {
        first: 'ομην',
        second: 'ου',
        third: 'ετο',
      },
      plural: {
        first: 'ομεθα',
        second: 'εσθε',
        third: 'οντο',
      },
    },
    ending: 'ομην',
  },
  αμην: {
    paradigm: {
      singular: {
        first: 'αμην',
        second: 'ω',
        third: 'ατο',
      },
      plural: {
        first: 'αμεθα',
        second: 'ασθε',
        third: 'αντο',
      },
    },
    ending: 'αμην',
  },
  ε: {
    paradigm: {
      singular: {
        first: null,
        second: 'ε',
        third: 'ετω',
      },
      plural: {
        first: null,
        second: 'ετε',
        third: 'ετωσαν',
      },
    },
    ending: 'ε',
  },
  σον: {
    paradigm: {
      singular: {
        first: null,
        second: 'ον',
        third: 'ατω',
      },
      plural: {
        first: null,
        second: 'ατε',
        third: 'ατωσαν',
      },
    },
    ending: 'σον',
  },
  ου: {
    paradigm: {
      singular: {
        first: null,
        second: 'ου',
        third: 'εσθω',
      },
      plural: {
        first: null,
        second: 'εσθε',
        third: 'εσθωσαν',
      },
    },
    ending: 'ου',
  },
  αι: {
    paradigm: {
      singular: {
        first: null,
        second: 'αι',
        third: 'ασθω',
      },
      plural: {
        first: null,
        second: 'ασθε',
        third: 'ασθωσαν',
      },
    },
    ending: 'αι',
  },
  ην: {
    paradigm: {
      singular: {
        first: 'ην',
        second: 'ης',
        third: 'η',
      },
      plural: {
        first: 'ημεν',
        second: 'ητε',
        third: 'ησαν',
      },
    },
    ending: 'ην',
  },
  ητι: {
    paradigm: {
      singular: {
        first: null,
        second: 'ητι',
        third: 'ητω',
      },
      plural: {
        first: null,
        second: 'ητε',
        third: 'ητωσαν',
      },
    },
    ending: 'ητι',
  },
  ηναι: null,
  ειν: null,
  εσθαι: null,
  ασθαι: null,
};

export const standardEndings: (
  Record<VerbTense, Record<VerbVoice, Record<VerbMood, VerbEnding | null> | null>>
) = {
  present: {
    active: {
      indicative: 'ω',
      imperative: 'ε',
      infinitive: 'ειν',
      participle: null,
      subjunctive: null,
    },
    middle: {
      indicative: 'ομαι',
      imperative: 'ου',
      infinitive: 'εσθαι',
      participle: null,
      subjunctive: null,
    },
    passive: null,
  },
  imperfect: {
    active: {
      indicative: 'ον',
      imperative: 'ε',
      infinitive: 'ειν',
      participle: null,
      subjunctive: null,
    },
    middle: {
      indicative: 'ομην',
      imperative: 'ου',
      infinitive: 'εσθαι',
      participle: null,
      subjunctive: null,
    },
    passive: null,
  },
  aorist: {
    active: {
      indicative: 'α',
      imperative: 'ον',
      infinitive: 'αι',
      participle: null,
      subjunctive: null,
    },
    middle: {
      indicative: 'αμην',
      imperative: 'αι',
      infinitive: 'ασθαι',
      participle: null,
      subjunctive: null,
    },
    passive: {
      indicative: 'ην',
      imperative: 'ητι',
      infinitive: 'ηναι',
      participle: null,
      subjunctive: null,
    },
  },
  future: {
    active: {
      indicative: 'ω',
      imperative: null,
      infinitive: null,
      participle: null,
      subjunctive: null,
    },
    middle: {
      indicative: 'ομαι',
      imperative: null,
      infinitive: null,
      participle: null,
      subjunctive: null,
    },
    passive: {
      indicative: 'ομαι',
      imperative: null,
      infinitive: null,
      participle: null,
      subjunctive: null,
    },
  },
};

export const tenseMarkers: (
  Partial<Record<
  VerbTense,
  Partial<Record<
  VerbVoice,
  Partial<Record<
  VerbMood,
  string
  >>
  >>
  >>
) = {
  future: {
    active: {
      indicative: 'σ',
    },
    middle: {
      indicative: 'σ',
    },
    passive: {
      indicative: 'θησ',
    },
  },
  aorist: {
    active: {
      indicative: 'σ',
      imperative: 'σ',
      infinitive: 'σ',
      subjunctive: 'σ',
    },
    middle: {
      indicative: 'σ',
      imperative: 'σ',
      infinitive: 'σ',
      subjunctive: 'σ',
    },
    passive: {
      indicative: 'θ',
    },
  },
};

export default paradigms;
