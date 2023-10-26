import type { VerbEnding } from './data/verbParadigms';

export type WordNumber = 'singular' | 'plural';

export type BaseData = {
  lexical: string,
  word: string,
  weight?: number,
}

export namespace Noun {
  export type Case = 'n' | 'g' | 'd' | 'a';
  export type Gender = 'masculine' | 'feminine' | 'neuter';

  export type Parsing = {
    nounCase: Case,
    gender: Gender,
    number: WordNumber,
  }

  export type Data = BaseData & {
    genitive: string,
    article: Article,
    singular?: boolean,
  };
}

export namespace Verb {
  export type Person = 'first' | 'second' | 'third';
  export type Tense = 'present' | 'imperfect' | 'aorist' | 'future'; // | 'perfect' | 'pluperfect';
  export type Mood = 'indicative' | 'imperative' | 'infinitive' | 'subjunctive' | 'participle';
  export type Voice = 'active' | 'middle' | 'passive';

  export type Parsing = {
    person: Person,
    number: WordNumber,
    tense: Tense,
    mood: Mood,
    voice: Voice,
  };

  export type Data = BaseData & {
    overrides?: OverrideParadigms,
    omit?: Tense[],
    preposition?: string,
    principalParts?: PrincipalParts,
    uniqueParadigm?: boolean,
  };

  export type ParadigmPattern = {
    singular: Record<Person, string | null>,
    plural: Record<Person, string | null>,
  };
  export type TenseParadigms = Record<Tense, ParadigmPattern | null>;
  export type VoiceParadigms = Record<Voice, TenseParadigms | null>;
  export type InfinitiveParadigm = {
    infinitive: Record<Voice, Record<Tense, string | null> | null>,
  };
  export type MoodParadigms = (
    Record<Exclude<Mood, 'infinitive'>, VoiceParadigms | null> & InfinitiveParadigm
  );
  export type OverrideParadigms = (
    Partial<Record<
    Mood,
    Partial<Record<
    Voice,
    Partial<Record<
    Tense,
    ParadigmPattern | null
    >> | null
    >> | null
    >>
  );

  export type PrincipalPartEnding = {
    stem: string,
    endings?: Partial<Record<Voice, Partial<Record<Mood, VerbEnding>>>>,
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
}

export type Article = 'ὁ' | 'ἡ' | 'το';
export type AdjectiveForm = '2-2-2' | '2-2';
export type GameCategory = 'firstAndSecondNouns' | 'verbs' | 'indicative' | 'imperative' | 'infinitive';

export type Word<T extends BaseData> = T extends Noun.Data ? Noun.Data : Verb.Data;
export type Parsing<T extends BaseData> = T extends Noun.Data ? Noun.Parsing : Verb.Parsing;
export type WordWithParsing<T extends BaseData> = {
  word: string,
  data: T,
  parsing: Parsing<T>,
};

export type ParsingOptions<T extends BaseData> = {
  [K in keyof Parsing<T>]: Parsing<T>[K][];
};

export type Report<P extends BaseData> = {
  word: string,
  correct: boolean,
  expected: Parsing<P>,
  given: Parsing<P>,
};

export type GameComponentProps<T extends BaseData> = {
  currentWord: WordWithParsing<T>,
  onAnswer: (correct: boolean, chosen: Parsing<T>) => void,
  params: ParsingOptions<T>,
};
