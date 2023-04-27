import paradigms, { type VerbEnding } from './data/verbParadigms';
import verbs, { VerbData } from './data/verbs';
import type { VerbMood, VerbPerson, VerbTense, VerbVoice, WordNumber } from './types';

export function conjugateVerb({
  mood,
  number,
  person,
  tense,
  verb,
  voice,
}: {
  mood: VerbMood,
  number: WordNumber,
  person: VerbPerson,
  tense: VerbTense,
  verb: string,
  voice: VerbVoice,
}) {
  const data = getVerbData(verb);
  const override = data.overrides?.[mood]?.[voice]?.[tense]?.[number]?.[person];
  if (override) {
    return override;
  }
  if (data.omit?.includes(tense)) {
    throw new Error(`Cannot conjugate ${verb} with ${tense} tense`);
  }
  if (data.uniqueParadigm) {
    return null;
  }

  const paradigm = getParadigm(verb);
  const ending = getEnding(verb);
  const preposition = getPreposition(data);
  const stem = verb.slice(preposition.length, verb.length - ending.length);
  const augmentedStem = applyAugment(preposition, stem, tense, mood);
  const paradigmForTense = paradigm.moods[mood]?.[voice]?.[tense];
  if (!paradigmForTense) {
    return null;
  }

  let conjugatedEnding: string | null;
  if (typeof paradigmForTense === 'string') {
    conjugatedEnding = paradigmForTense;
  } else {
    conjugatedEnding = paradigmForTense[number][person];
  }
  if (!conjugatedEnding) {
    return null;
  }

  const result = applyEnding(augmentedStem, conjugatedEnding);
  return result;
}

export function getParadigm(verb: string) {
  const ending = getEnding(verb);
  const paradigm = paradigms[ending];
  return paradigm;
}

export function getEnding(verb: string) {
  // const endings: VerbEnding[] = ['εω', 'ω'];
  const endings: VerbEnding[] = ['ω'];
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

export function applyEnding(stem: string, ending: string) {
  const x = '!!!!';
  return (
    `${stem}${x}${ending}`
      .replace(new RegExp(`[κγχ]${x}σ`), `ξ${x}`)
      .replace(new RegExp(`[πβφ]${x}σ`), `ψ${x}`)
      .replace(new RegExp(`[τδθ]${x}σ`), `σ${x}`)
      .replace(new RegExp(`ε${x}σ`), `${x}ησ`)
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
