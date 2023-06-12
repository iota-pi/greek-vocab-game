import type { PrincipalParts, VerbOverrideParadigms, VerbTense } from '../types';
import { applyWeightings } from '../util';

export type VerbData = {
  lexical: string,
  word: string,
  overrides?: VerbOverrideParadigms,
  omit?: VerbTense[],
  preposition?: string,
  principalParts?: PrincipalParts,
  weight?: number,
  uniqueParadigm?: boolean,
};

const rawVerbs: VerbData[] = [
  {
    word: 'εἰμι',
    lexical: 'εἰμι',
    principalParts: {
      future: {
        stem: 'ἐ',
        endings: {
          active: {
            indicative: 'ομαι',
          },
          middle: {
            indicative: 'ομαι',
          },
        },
      },
    },
    overrides: {
      indicative: {
        active: {
          present: {
            singular: {
              first: 'εἰμι',
              second: 'εἶ',
              third: 'ἐστιν',
            },
            plural: {
              first: 'ἐσμεν',
              second: 'ἐστε',
              third: 'εἰσιν',
            },
          },
          imperfect: {
            singular: {
              first: 'ἠμην',
              second: 'ἠς|ἠσθα',
              third: 'ἠν',
            },
            plural: {
              first: 'ἠμεν|ἠμεθα',
              second: 'ἠτε',
              third: 'ἠσαν',
            },
          },
        },
      },
    },
    omit: ['aorist'],
    weight: 2,
    uniqueParadigm: true,
  },
  {
    word: 'λυω',
    lexical: 'λυω',
  },
  {
    word: 'γραφω',
    lexical: 'γραφω',
  },
  {
    word: 'ἐσθιω',
    lexical: 'ἐσθιω',
  },
  {
    word: 'εὑρισκω',
    lexical: 'εὑρισκω',
    principalParts: {
      future: {
        stem: 'εὑρη',
      },
    },
  },
  {
    word: 'ἐχω',
    lexical: 'ἐχω',
    principalParts: {
      aorist: {
        stem: 'εσχ',
        noAugment: true,
        noTenseMarker: true,
        endings: {
          active: {
            indicative: 'ον',
          },
          middle: {
            indicative: 'ομην',
          },
        },
      },
      future: {
        stem: 'ἑχ',
        noAugment: true,
      },
    },
    overrides: {
      indicative: {
        active: {
          imperfect: {
            singular: {
              first: 'εἰχον',
              second: 'εἰχες',
              third: 'εἰχεν',
            },
            plural: {
              first: 'εἰχομεν',
              second: 'εἰχετε',
              third: 'εἰχον',
            },
          },
        },
      },
    },
  },
  {
    word: 'θελω',
    lexical: 'θελω',
    overrides: {
      indicative: {
        active: {
          imperfect: {
            singular: {
              first: 'ἠθελον',
              second: 'ἠθελες',
              third: 'ἠθελεν',
            },
            plural: {
              first: 'ἠθελομεν',
              second: 'ἠθελετε',
              third: 'ἠθελον',
            },
          },
          aorist: {
            singular: {
              first: 'ἠθελσα',
              second: 'ἠθελσας',
              third: 'ἠθελσεν',
            },
            plural: {
              first: 'ἠθελσαμεν',
              second: 'ἠθελσατε',
              third: 'ἠθελσαν',
            },
          },
        },
      },
    },
  },
  {
    word: 'λεγω',
    lexical: 'λεγω',
    principalParts: {
      future: {
        stem: 'ἐρε',
        noTenseMarker: true,
      },
    },
  },
  {
    word: 'πιστευω',
    lexical: 'πιστευω',
  },
  {
    word: 'ἀκολoυθεω',
    lexical: 'ἀκολoυθεω',
  },
  {
    word: 'ζητεω',
    lexical: 'ζητεω',
  },
  {
    word: 'καλεω',
    lexical: 'καλεω',
    principalParts: {
      aorist: {
        stem: 'καλεσ',
        noTenseMarker: true,
      },
      future: {
        stem: 'καλεσ',
        noTenseMarker: true,
      },
    },
  },
  {
    word: 'κρατεω',
    lexical: 'κρατεω',
  },
  {
    word: 'λαλεω',
    lexical: 'λαλεω',
  },
  {
    word: 'ποιεω',
    lexical: 'ποιεω',
  },
  {
    word: 'φωνεω',
    lexical: 'φωνεω',
  },
  {
    word: 'φερω',
    lexical: 'φερω',
    principalParts: {
      future: {
        stem: 'οἰ',
      },
      aoristPassive: {
        stem: 'οἰ',
        noAugment: true,
      },
      aorist: {
        stem: 'ἠνεγκ',
        noTenseMarker: true,
        noAugment: true,
      },
    },
  },
  {
    word: 'σῳζω',
    lexical: 'σῳζω',
    principalParts: {
      aorist: {
        stem: 'σω',
      },
      future: {
        stem: 'σω',
      },
      aoristPassive: {
        stem: 'σω',
      },
    },
  },
  {
    word: 'διακονεω',
    lexical: 'διακονεω',
    preposition: 'δι',
  },
  {
    word: 'ἀποστελλω',
    lexical: 'ἀποστελλω',
    preposition: 'ἀπο',
  },
  {
    word: 'ἐκβαλλω',
    lexical: 'ἐκβαλλω',
    preposition: 'ἐκ',
  },
  {
    word: 'παρακαλεω',
    lexical: 'παρακαλεω',
    preposition: 'παρα',
  },
  {
    word: 'προσφερω',
    lexical: 'προσφερω',
    preposition: 'προσ',
  },
  {
    word: 'ὑπαγω',
    lexical: 'ὑπαγω',
    preposition: 'ὑπ',
  },
];

const verbs = applyWeightings(rawVerbs);

export default verbs;
