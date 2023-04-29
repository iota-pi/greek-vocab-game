export type NounCase = 'n' | 'g' | 'd' | 'a';
export type Gender = 'masculine' | 'feminine' | 'neuter';
export type WordNumber = 'singular' | 'plural';
export type VerbPerson = 'first' | 'second' | 'third';
export type VerbTense = 'present' | 'imperfect' | 'aorist' | 'future'; // | 'perfect' | 'pluperfect';
export type VerbMood = 'indicative' | 'imperative' | 'infinitive' | 'subjunctive' | 'participle';
export type VerbVoice = 'active' | 'middle';
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

export type NounWithParsing = NounParsing & {
  word: string,
  lexical: string,
};

export type VerbWithParsing = VerbParsing & {
  word: string,
  lexical: string,
};

export type Report<P> = {
  word: string,
  correct: boolean,
  expected: P,
  given: P,
};
