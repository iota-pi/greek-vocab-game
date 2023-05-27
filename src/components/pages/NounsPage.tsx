import nouns from '../../data/nouns';
import { declineNoun, getGender } from '../../decliner';
import type {
  NounCase,
  NounParsing,
  WordWithParsing,
  WordNumber,
} from '../../types';
import { getCaseName, getGenderName, getNumberName } from '../../util';
import GameBase from '../games/GameBase';
import Nouns from '../games/Nouns';

const CASES: NounCase[] = ['n', 'g', 'd', 'a'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];

function pickWord(): WordWithParsing<NounParsing> {
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const gender = getGender(noun.word);
  const nounCase = CASES[Math.floor(Math.random() * CASES.length)];
  let number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  if (noun.singular) {
    number = 'singular';
  }
  try {
    const word = declineNoun({ noun: noun.word, nounCase, number });
    return {
      word,
      lexical: noun.word,
      nounCase,
      number,
      gender,
    };
  } catch (error) {
    // Log error and re-attempt
    console.log(
      `Error while declining word ${noun.word} ${nounCase} ${number}`,
    );
    console.error(error);
    return pickWord();
  }
}

function NounsPage() {
  return (
    <GameBase
      formatter={(
        parsing => (
          [
            getCaseName(parsing.nounCase),
            getNumberName(parsing.number),
            getGenderName(parsing.gender),
          ].join(' ')
        )
      )}
      gameComponent={Nouns}
      numQuestions={20}
      pickWord={pickWord}
    />
  );
}

export default NounsPage;
