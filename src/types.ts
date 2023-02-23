export type NounCase = 'n' | 'g' | 'd' | 'a';
export type VerbPerson = 'first' | 'second' | 'third';
export type WordNumber = 'singular' | 'plural';
export type Gender = 'masculine' | 'feminine' | 'neuter';
export type Article = 'ὁ' | 'ἡ' | 'το';
export type GameCategory = 'nouns' | 'verbs';


export type NounParsing = {
  nounCase: NounCase,
  gender: Gender,
  number: WordNumber,
};

export type VerbParsing = {
  person: VerbPerson,
  number: WordNumber,
};

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
