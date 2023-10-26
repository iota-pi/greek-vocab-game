import paradigms, { ParadigmName, type NounEnding } from './data/nounParadigms';
import nouns from './data/nouns';
import type { Article, Noun, WordNumber } from './types';

export function declineNoun({
  noun,
  nounCase,
  number,
}: {
  noun: Noun.Data,
  nounCase: Noun.Case,
  number: WordNumber,
}) {
  const word = noun.word;
  const paradigm = getParadigm(word);
  const ending = getEnding(word);
  const stem = word.slice(0, word.length - ending.length);
  const newEnding = paradigm.pattern[number][nounCase];
  const result = `${stem}${newEnding}`;
  return result;
}

export function getParadigm(noun: string) {
  const nounData = getNounData(noun);
  const ending = getEnding(noun);
  const genitive = nounData.genitive;
  const paradigmName = `${ending}-${genitive}` as ParadigmName;
  const paradigm = paradigms[paradigmName];
  return paradigm;
}

export function getEnding(noun: string) {
  const endings: Record<NounEnding, true> = {
    ος: true,
    η: true,
    α: true,
    ον: true,
    ης: true,
    ας: true,
  };
  for (const ending of Object.keys(endings)) {
    if (noun.endsWith(ending)) {
      return ending;
    }
  }
  throw new Error(`Unrecognised ending ${noun}`);
}

export function getGender(noun: string) {
  const nounData = getNounData(noun);
  const mapping: Record<Article, Noun.Gender> = {
    ἡ: 'feminine',
    ὁ: 'masculine',
    το: 'neuter',
  };
  return mapping[nounData.article];
}

export function getNounData(noun: string) {
  const nounData = nouns.find(n => n.word === noun);
  if (!nounData) {
    throw new Error(`Could not find word data for ${noun}`);
  }
  return nounData;
}
