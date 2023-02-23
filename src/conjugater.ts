import paradigms, { type VerbEnding } from './data/verbParadigms';
import verbs from './data/verbs';
import type { VerbPerson, WordNumber } from './types';

export function conjugateVerb({
  verb,
  person,
  number,
}: {
  verb: string,
  person: VerbPerson,
  number: WordNumber,
}) {
  const paradigm = getParadigm(verb);
  const ending = getEnding(verb);
  const stem = verb.slice(0, verb.length - ending.length);
  const newEnding = paradigm.pattern[number][person];
  const result = `${stem}${newEnding}`;
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

export function getVerbData(verb: string) {
  const nounData = verbs.find(n => n.word === verb);
  if (!nounData) {
    throw new Error(`Could not find word data for ${verb}`);
  }
  return nounData;
}
