import verbs from '../../data/verbs';
import type {
  VerbPerson,
  WordNumber,
  VerbParsing,
  WordWithParsing,
} from '../../types';
import { getNumberName, getPersonName } from '../../util';
import { conjugateVerb } from '../../conjugater';
import PresentVerbs from '../games/PresentVerbs';
import GameBase from '../games/GameBase';

const PERSONS: VerbPerson[] = ['first', 'second', 'third'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];

function pickWord(): WordWithParsing<VerbParsing> {
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const person = PERSONS[Math.floor(Math.random() * PERSONS.length)];
  const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  const tense = 'present';
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
      category="verbs"
      title="Present Active Indicative Verbs"
      formatter={(
        parsing => (
          [
            getPersonName(parsing.person),
            getNumberName(parsing.number),
          ].join(' ')
        )
      )}
      gameComponent={PresentVerbs}
      numQuestions={10}
      pickWord={pickWord}
    />
  );
}

export default PresentVerbsPage;
