export type NounCase = 'n' | 'g' | 'd' | 'a';
export type WordNumber = 'singular' | 'plural';
export type Gender = 'masculine' | 'feminine' | 'neuter';
export type Article = 'ὁ' | 'ἡ' | 'το';
export type GameCategory = 'nouns';


export type NounParsing = {
  nounCase: NounCase,
  gender: Gender,
  number: WordNumber,
};

export type NounWithParsing = NounParsing & {
  word: string,
  lexical: string,
};

export type Report<P> = {
  word: string,
  correct: boolean,
  expected: P,
  given: P,
};
