import paradigms, { type VerbEnding } from './data/verbParadigms';
import verbs, { VerbData } from './data/verbs';
import type { VerbPerson, VerbTense, WordNumber } from './types';

export function conjugateVerb({
  number,
  person,
  tense,
  verb,
}: {
  number: WordNumber,
  person: VerbPerson,
  tense: VerbTense,
  verb: string,
}) {
  const data = getVerbData(verb);
  const overwrite = data.overwrites?.[tense]?.[number]?.[person];
  if (overwrite) {
    return overwrite;
  }
  if (data.omit?.includes(tense)) {
    throw new Error(`Cannot conjugate ${verb} with ${tense} tense`);
  }

  const paradigm = getParadigm(verb);
  const ending = getEnding(verb);
  const preposition = getPreposition(data);
  const stem = verb.slice(preposition.length, verb.length - ending.length);
  const augmentedStem = applyAugment(preposition, stem, tense);
  const paradigmForTense = paradigm.tenses[tense];
  const newEnding = paradigmForTense[number][person];
  const result = applyEnding(augmentedStem, newEnding);
  return result;
}

export function getParadigm(verb: string) {
  const ending = getEnding(verb);
  const paradigm = paradigms[ending];
  return paradigm;
}

export function getEnding(verb: string) {
  const endings: VerbEnding[] = ['εω', 'ω'];
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
      .replaceAll(x, '')
  );
}

export function getAugment(tense: VerbTense) {
  const map: Record<VerbTense, string> = {
    aorist: 'ἐ',
    imperfect: 'ἐ',
    present: '',
    future: '',
  };
  return map[tense];
}

export function applyAugment(preposition: string, stem: string, tense: VerbTense) {
  const x = '!!!!';
  const augment = getAugment(tense);
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
