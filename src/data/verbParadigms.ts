import { VerbMoodParadigms } from '../types';

export type Paradigm = {
  example: string,
  moods: VerbMoodParadigms,
  ending: VerbEnding,
};
export type VerbEnding = 'ω';

const paradigms: Record<VerbEnding, Paradigm> = {
  ω: {
    example: 'λυω',
    moods: {
      indicative: {
        active: {
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
        middle: {
          present: {
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
          imperfect: {
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
          future: {
            singular: {
              first: 'σομαι',
              second: 'σῃ',
              third: 'σεται',
            },
            plural: {
              first: 'σομεθα',
              second: 'σεσθε',
              third: 'σονται',
            },
          },
          aorist: {
            singular: {
              first: 'σαμην',
              second: 'σω',
              third: 'σατο',
            },
            plural: {
              first: 'σαμεθα',
              second: 'σασθε',
              third: 'σαντο',
            },
          },
        },
      },
      imperative: {
        active: {
          present: {
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
          aorist: {
            singular: {
              first: null,
              second: 'σον',
              third: 'σατω',
            },
            plural: {
              first: null,
              second: 'σατε',
              third: 'σατωσαν',
            },
          },
          future: null,
          imperfect: null,
        },
        middle: {
          present: {
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
          aorist: {
            singular: {
              first: null,
              second: 'σαι',
              third: 'σασθω',
            },
            plural: {
              first: null,
              second: 'σασθε',
              third: 'σασθωσαν',
            },
          },
          future: null,
          imperfect: null,
        },
      },
      infinitive: {
        active: {
          present: 'ειν',
          aorist: 'σαι',
          future: null,
          imperfect: null,
        },
        middle: {
          present: 'εσθαι',
          aorist: 'σασθαι',
          future: null,
          imperfect: null,
        },
      },
      participle: null,
      subjunctive: null,
    },
    ending: 'ω',
  },
  // TODO: replace with contraction rules
  // εω: {
  //   example: 'ποιεω',
  //   tenses: {
  //     present: {
  //       singular: {
  //         first: 'ω',
  //         second: 'εις',
  //         third: 'ει',
  //       },
  //       plural: {
  //         first: 'ουμεν',
  //         second: 'ειτε',
  //         third: 'ουσιν',
  //       },
  //     },
  //     imperfect: {
  //       singular: {
  //         first: 'ουν',
  //         second: 'εις',
  //         third: 'ει',
  //       },
  //       plural: {
  //         first: 'ουμεν',
  //         second: 'ειτε',
  //         third: 'ουν',
  //       },
  //     },
  //     aorist: {
  //       singular: {
  //         first: 'ησα',
  //         second: 'ησας',
  //         third: 'ησεν',
  //       },
  //       plural: {
  //         first: 'ησαμεν',
  //         second: 'ησατε',
  //         third: 'ησαν',
  //       },
  //     },
  //     future: {
  //       singular: {
  //         first: 'ησω',
  //         second: 'ησεις',
  //         third: 'ησει',
  //       },
  //       plural: {
  //         first: 'ησομεν',
  //         second: 'ησετε',
  //         third: 'ησουσιν',
  //       },
  //     },
  //   },
  //   ending: 'εω',
  // },
};

export default paradigms;
