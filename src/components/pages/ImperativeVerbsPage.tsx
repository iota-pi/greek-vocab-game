import verbs from '../../data/verbs';
import type {
  VerbPerson,
  WordWithParsing,
  WordNumber,
  VerbParsing,
  VerbTense,
  VerbMood,
  VerbVoice,
} from '../../types';
import { getNumberName, getPersonName, getTenseName, getVoiceName } from '../../util';
import { conjugateVerb } from '../../conjugater';
import GameBase from '../games/GameBase';

const PERSONS: VerbPerson[] = ['second', 'third'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];
const TENSES: VerbTense[] = ['present', 'aorist'];
const VOICES: VerbVoice[] = ['active', 'middle'];

const mood: VerbMood = 'imperative';

function pickWord(): WordWithParsing<VerbParsing> {
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const person = PERSONS[Math.floor(Math.random() * PERSONS.length)];
  const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  const validTenses = TENSES.filter(t => !verb.omit?.includes(t));
  const tense = validTenses[Math.floor(Math.random() * validTenses.length)];
  const voice = VOICES[Math.floor(Math.random() * VOICES.length)];

  try {
    const word = conjugateVerb({
      person,
      mood,
      number,
      tense,
      verb: verb.word,
      voice,
    });
    if (word === null) {
      return pickWord();
    }

    return {
      lexical: verb.word,
      person,
      mood,
      number,
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

function ImperativeVerbs() {
  return (
    <GameBase
      formatter={(
        parsing => (
          [
            getTenseName(parsing.tense),
            getVoiceName(parsing.voice),
            getPersonName(parsing.person),
            getNumberName(parsing.number),
          ].join(' ')
        )
      )}
      gameComponent={ImperativeVerbs}
      numQuestions={10}
      pickWord={pickWord}
    />
  );
}

export default ImperativeVerbs;
