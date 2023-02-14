import paradigms, { ParadigmName, type NounEnding } from './data/paradigms';
import nouns from './data/nouns';
import type { Article, Gender, NounCase, WordNumber } from './types';

export function declineNoun({
  noun,
  nounCase,
  number,
}: {
  noun: string,
  nounCase: NounCase,
  number: WordNumber,
}) {
  const paradigm = getParadigm(noun);
  const ending = getEnding(noun);
  const stem = noun.slice(0, noun.length - ending.length);
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
  const endings: NounEnding[] = [
    'ος',
    'η',
    'α',
    'ον',
  ];
  for (const ending of endings) {
    if (noun.endsWith(ending)) {
      return ending;
    }
  }
  throw new Error(`Unrecognised ending ${noun}`);
}

export function getGender(noun: string) {
  const nounData = getNounData(noun);
  const mapping: Record<Article, Gender> = {
    ἡ: 'feminine',
    ὁ: 'masculine',
    το: 'neuter',
  };
  return mapping[nounData.article]
}

export function getNounData(noun: string) {
  const nounData = nouns.find(n => n.word === noun);
  if (!nounData) {
    throw new Error(`Could not find word data for ${noun}`);
  }
  return nounData;
}
