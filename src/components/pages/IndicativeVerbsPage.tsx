import verbs from '../../data/verbs';
import type {
  VerbPerson,
  WordNumber,
  VerbParsing,
  WordWithParsing,
  VerbTense,
} from '../../types';
import { getNumberName, getPersonName, getTenseName } from '../../util';
import { conjugateVerb } from '../../conjugater';
import GameBase from '../games/GameBase';
import IndicativeVerbs from '../games/IndicativeVerbs';

const PERSONS: VerbPerson[] = ['first', 'second', 'third'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];
const TENSES: VerbTense[] = ['present', 'imperfect', 'aorist', 'future'];


function pickWord(): WordWithParsing<VerbParsing> {
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const person = PERSONS[Math.floor(Math.random() * PERSONS.length)];
  const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  const validTenses = TENSES.filter(t => !verb.omit?.includes(t));
  const tense = validTenses[Math.floor(Math.random() * validTenses.length)];
  const mood = 'indicative';
  const voice = 'active';
  try {
    const word = conjugateVerb({
      mood,
      number,
      person,
      tense,
      verb: verb.word,
      voice,
    });
    if (word === null) {
      return pickWord();
    }

    return {
      lexical: verb.word,
      mood,
      number,
      person,
      tense,
      voice,
      word,
    };
  } catch (error) {
    // Log error and re-attempt
    console.log(
      `Error while declining word ${verb.word} ${person} ${number}`,
    );
    console.error(error);
    return pickWord();
  }
}

function PresentVerbsPage() {
  return (
    <GameBase
      formatter={(
        parsing => (
          [
            getTenseName(parsing.tense),
            getPersonName(parsing.person),
            getNumberName(parsing.number),
          ].join(' ')
        )
      )}
      gameComponent={IndicativeVerbs}
      numQuestions={10}
      pickWord={pickWord}
    />
  );
}

export default PresentVerbsPage;
