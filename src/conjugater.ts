import paradigms, { standardEndings, tenseMarkers, type VerbEnding } from './data/verbParadigms';
import verbs, { VerbData } from './data/verbs';
import type { PrincipalPart, VerbMood, VerbPerson, VerbTense, VerbVoice, WordNumber } from './types';

export type ConjugateVerbParams = {
  mood: VerbMood,
  number: WordNumber,
  person: VerbPerson,
  tense: VerbTense,
  verb: string,
  voice: VerbVoice,
};

export function conjugateVerb({
  mood,
  number,
  person,
  tense,
  verb,
  voice,
}: ConjugateVerbParams): string | null {
  const data = getVerbData(verb);
  const override = data.overrides?.[mood]?.[voice]?.[tense];
  if (override) {
    const overrideResult = (
      typeof override === 'string'
        ? override
        : override?.[number]?.[person]
    );
    if (overrideResult) {
      return overrideResult;
    }
  }
  if (data.omit?.includes(tense)) {
    throw new Error(`Cannot conjugate ${verb} with ${tense} tense`);
  }

  const principalPart = getPrincipalPart(data, tense, voice);
  if (!principalPart && data.uniqueParadigm) {
    return null;
  }

  const baseWord = principalPart?.stem || verb;
  const paradigm = (
    principalPart?.endings?.[voice]?.[mood]
    || standardEndings?.[tense]?.[voice]?.[mood]
  );
  if (!paradigm) {
    return null;
  }

  const preposition = getPreposition(data);
  let stem: string;
  if (!principalPart) {
    const ending = getEnding(baseWord);
    const originalStem = baseWord.slice(preposition.length, baseWord.length - ending.length);
    stem = applyAugment(preposition, originalStem, tense, mood);
  } else if (!principalPart?.noAugment) {
    stem = applyAugment(preposition, baseWord, tense, mood);
  } else {
    stem = baseWord;
  }

  const tenseMarker = (
    principalPart?.noTenseMarker
      ? ''
      : tenseMarkers?.[tense]?.[voice]?.[mood]
  ) || '';

  let conjugatedEnding: string | undefined | null;
  if (mood === 'infinitive') {
    conjugatedEnding = paradigm;
  } else {
    conjugatedEnding = paradigms[paradigm]?.paradigm?.[number]?.[person];
  }
  if (!conjugatedEnding) {
    return null;
  }

  const result = applyEnding(stem, tenseMarker, conjugatedEnding);
  return result;
}

export function getConjugatedVerb(params: ConjugateVerbParams) {
  const result = conjugateVerb(params);
  return result && chooseStringPart(result);
}

export function checkConjugation(toCheck: string, params: ConjugateVerbParams): boolean {
  const result = conjugateVerb(params);
  if (!result) {
    return false;
  }
  const parts = getStringParts(result);
  return parts.includes(toCheck);
}

export function getPrincipalPart(verb: VerbData, tense: VerbTense, voice: VerbVoice) {
  let principalPart: PrincipalPart;
  if (
    voice === 'passive'
    && (tense === 'aorist' || tense === 'future')
  ) {
    principalPart = 'aoristPassive';
  } else if (tense === 'present' || tense === 'imperfect') {
    principalPart = 'present';
  } else if (tense === 'future') {
    principalPart = 'future';
  } else if (tense === 'aorist') {
    principalPart = 'aorist';
  } else {
    return null;
  }
  return verb.principalParts?.[principalPart] || null;
}

export function getEnding(verb: string) {
  const endings: VerbEnding[] = [
    'ομαι',
    'αμην',
    'ειν',
    'εσθαι',
    'ομην',
    'ασθαι',
    'αι',
    'σον',
    'ον',
    'ου',
    'ω',
    'α',
    'ε',
  ];
  for (const ending of endings) {
    if (verb.endsWith(ending)) {
      return ending;
    }
  }
  throw new Error(`Unrecognised ending ${verb}`);
}

export function getPreposition(data: VerbData) {
  return data.preposition ?? '';
}

export function getStringParts(string: string, delimiter = '|') {
  return string.split(delimiter);
}

export function chooseStringPart(string: string, delimiter = '|') {
  const parts = getStringParts(string, delimiter);
  const part = parts[Math.floor(Math.random() * parts.length)];
  return part;
}

export function applyEnding(stem: string, tenseMarker: string, endingString: string) {
  const ending = chooseStringPart(endingString);
  const x = '!!!!';
  return (
    `${stem}${x}${tenseMarker}${ending}`
      .replace(new RegExp(`[κγχ]${x}σ`), `ξ${x}`)
      .replace(new RegExp(`[πβφ]${x}σ`), `ψ${x}`)
      .replace(new RegExp(`[τδθ]${x}σ`), `σ${x}`)
      .replace(new RegExp(`ε${x}σ`), `${x}ησ`)
      .replace(new RegExp(`ε${x}θ`), `${x}ηθ`)
      .replace(new RegExp(`ε${x}ε(?![ιυ])`), `${x}ει`)
      .replace(new RegExp(`ε${x}ει`), `${x}ει`)
      .replace(new RegExp(`ε${x}ο(?![ιυ])`), `${x}ου`)
      .replace(new RegExp(`ε${x}ου`), `${x}ου`)
      .replace(new RegExp(`ε${x}ω`), `${x}ω`)
      .replace(new RegExp(`ε${x}η(?!υ)`), `${x}η`)
      .replaceAll(x, '')
  );
}

export function getAugment(tense: VerbTense, mood: VerbMood) {
  if (mood !== 'indicative') {
    return '';
  }

  const map: Record<VerbTense, string> = {
    aorist: 'ἐ',
    imperfect: 'ἐ',
    present: '',
    future: '',
  };
  return map[tense];
}

export function applyAugment(preposition: string, stem: string, tense: VerbTense, mood: VerbMood) {
  const x = '!!!!';
  const augment = getAugment(tense, mood);
  const modifiedPreposition = !augment ? preposition : (
    preposition
      .replace(/ἐκ/, 'ἐξ')
      .replace(/παρα/, 'παρ')
      .replace(/ἀπο/, 'ἀπ')
      .replace(/ἐπο/, 'ἐπ')
      .replace(/ὑπο/, 'ὑπ')
      .replace(/μετα/, 'μετ')
  );
  const simplisticAugment = `${modifiedPreposition}${x}${augment}${stem}`;
  return (
    simplisticAugment
      .replace(new RegExp(`(${x})ἐει`), '$1ῃ')
      .replace(new RegExp(`(${x})ἐε`), '$1η')
      .replace(new RegExp(`(${x})ἐαι`), '$1ῃ')
      .replace(new RegExp(`(${x})ἐα`), '$1η')
      .replace(new RegExp(`(${x})ἐοι`), '$1ῳ')
      .replace(new RegExp(`(${x})ἐο`), '$1ω')
      .replace(new RegExp(`(${x})ἐ(..?[̔̓])`), '$1ε$2')
      .replace(new RegExp(`(.${x})(..?)[̔̓]`), '$1$2')
      .replaceAll(x, '')
  );
}

export function getVerbData(verb: string) {
  const verbData = verbs.find(n => n.word === verb);
  if (!verbData) {
    throw new Error(`Could not find word data for ${verb}`);
  }
  return verbData;
}
