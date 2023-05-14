import type { VerbOverrideParadigms, VerbTense } from '../types';
import { applyWeightings } from '../util';

export type VerbData = {
  lexical: string,
  word: string,
  overrides?: VerbOverrideParadigms,
  omit?: VerbTense[],
  preposition?: string,
  weight?: number,
  uniqueParadigm?: boolean,
};

const rawVerbs: VerbData[] = [
  {
    word: 'εἰμι',
    lexical: 'εἰμι',
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
    overrides: {
      indicative: {
        active: {
          future: {
            singular: {
              first: 'εὑρησω',
              second: 'εὑρησεις',
              third: 'εὑρησει',
            },
            plural: {
              first: 'εὑρησομεν',
              second: 'εὑρησετε',
              third: 'εὑρησουσιν',
            },
          },
        },
      },
    },
  },
  {
    word: 'ἐχω',
    lexical: 'ἐχω',
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
          aorist: {
            singular: {
              first: 'εἰξα',
              second: 'εἰξες',
              third: 'εἰξεν',
            },
            plural: {
              first: 'εἰξαμεν',
              second: 'εἰξατε',
              third: 'εἰξαν',
            },
          },
          future: {
            singular: {
              first: 'ἑξω',
              second: 'ἑξεις',
              third: 'ἑξει',
            },
            plural: {
              first: 'ἑξομεν',
              second: 'ἑξετε',
              third: 'ἑξουσιν',
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
    overrides: {
      indicative: {
        active: {
          future: {
            singular: {
              first: 'ἐρω',
              second: 'ἐρεις',
              third: 'ἐρει',
            },
            plural: {
              first: 'ἐρομεν',
              second: 'ἐρετε',
              third: 'ἐρουσιν',
            },
          },
        },
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
    overrides: {
      indicative: {
        active: {
          aorist: {
            singular: {
              first: 'ἐκαλεσα',
              second: 'ἐκαλεσας',
              third: 'ἐκαλεσεν',
            },
            plural: {
              first: 'ἐκαλεσαμεν',
              second: 'ἐκαλεσατε',
              third: 'ἐκαλεσαν',
            },
          },
          future: {
            singular: {
              first: 'καλεσω',
              second: 'καλεσεις',
              third: 'καλεσει',
            },
            plural: {
              first: 'καλεσομεν',
              second: 'καλεσετε',
              third: 'καλεσουσιν',
            },
          },
        },
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
    overrides: {
      indicative: {
        active: {
          aorist: {
            singular: {
              first: 'ἠνεγκα',
              second: 'ἠνεγκασ',
              third: 'ἠνεγκεν',
            },
            plural: {
              first: 'ἠνεγκαμεν',
              second: 'ἠνεγκατε',
              third: 'ἠνεγκαν',
            },
          },
          future: {
            singular: {
              first: 'οἰσω',
              second: 'οἰσεις',
              third: 'οἰσει',
            },
            plural: {
              first: 'οἰσομεν',
              second: 'οἰσετε',
              third: 'οἰσουσιν',
            },
          },
        },
      },
    },
  },
  {
    word: 'σῳζω',
    lexical: 'σῳζω',
    overrides: {
      indicative: {
        active: {
          aorist: {
            singular: {
              first: 'ἐσωσα',
              second: 'ἐσωσασ',
              third: 'ἐσωσεν',
            },
            plural: {
              first: 'ἐσωσαμεν',
              second: 'ἐσωσατε',
              third: 'ἐσωσαν',
            },
          },
          future: {
            singular: {
              first: 'σωσω',
              second: 'σωσεις',
              third: 'σωσει',
            },
            plural: {
              first: 'σωσομεν',
              second: 'σωσετε',
              third: 'σωσουσιν',
            },
          },
        },
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
