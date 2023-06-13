import type { VerbEnding } from './data/verbParadigms';

export type NounCase = 'n' | 'g' | 'd' | 'a';
export type Gender = 'masculine' | 'feminine' | 'neuter';
export type WordNumber = 'singular' | 'plural';
export type VerbPerson = 'first' | 'second' | 'third';
export type VerbTense = 'present' | 'imperfect' | 'aorist' | 'future'; // | 'perfect' | 'pluperfect';
export type VerbMood = 'indicative' | 'imperative' | 'infinitive' | 'subjunctive' | 'participle';
export type VerbVoice = 'active' | 'middle' | 'passive';
export type Article = 'ὁ' | 'ἡ' | 'το';
export type AdjectiveForm = '2-2-2' | '2-2';
export type GameCategory = 'nouns' | 'verbs' | 'indicative' | 'imperative' | 'infinitive';

export type NounParsing = {
  nounCase: NounCase,
  gender: Gender,
  number: WordNumber,
};

export type VerbParsing = {
  person: VerbPerson,
  number: WordNumber,
  tense: VerbTense,
  mood: VerbMood,
  voice: VerbVoice,
};

export type VerbParadigmPattern = {
  singular: Record<VerbPerson, string | null>,
  plural: Record<VerbPerson, string | null>,
};
export type VerbTenseParadigms = Record<VerbTense, VerbParadigmPattern | null>;
export type VerbVoiceParadigms = Record<VerbVoice, VerbTenseParadigms | null>;
export type InfinitiveParadigm = {
  infinitive: Record<VerbVoice, Record<VerbTense, string | null> | null>,
};
export type VerbMoodParadigms = (
  Record<Exclude<VerbMood, 'infinitive'>, VerbVoiceParadigms | null> & InfinitiveParadigm
);
export type VerbOverrideParadigms = (
  Partial<Record<
  VerbMood,
  Partial<Record<
  VerbVoice,
  Partial<Record<
  VerbTense,
  VerbParadigmPattern | null
  >> | null
  >> | null
  >>
);

export type PrincipalPartEnding = {
  stem: string,
  endings?: Partial<Record<VerbVoice, Partial<Record<VerbMood, VerbEnding>>>>,
  noTenseMarker?: boolean,
  noAugment?: boolean,
  noTenseLengthening?: boolean,
};
export type PrincipalParts = {
  aorist?: PrincipalPartEnding,
  aoristPassive?: PrincipalPartEnding,
  future?: PrincipalPartEnding,
  perfect?: PrincipalPartEnding,
  perfectPassive?: PrincipalPartEnding,
  present?: PrincipalPartEnding,
};
export type PrincipalPart = keyof PrincipalParts;

export type WordWithParsing<P> = P & {
  word: string,
  lexical: string,
};

export type Report<P> = {
  word: string,
  correct: boolean,
  expected: P,
  given: P,
};

export type GameComponentProps<T> = {
  currentWord: WordWithParsing<T>,
  onAnswer: (correct: boolean, chosen: T) => void,
};
