import verbs from '../../data/verbs';
import type {
  VerbPerson,
  WordNumber,
  VerbParsing,
  VerbTense,
  VerbMood,
  VerbVoice,
  WordWithParsing,
} from '../../types';
import { getTenseName, getVoiceName } from '../../util';
import { conjugateVerb } from '../../conjugater';
import GameBase from '../games/GameBase';
import InfinitiveVerbs from '../games/InfinitiveVerbs';

const TENSES: VerbTense[] = ['present', 'aorist'];
const VOICES: VerbVoice[] = ['active', 'middle'];

const person: VerbPerson = 'first';
const number: WordNumber = 'singular';
const mood: VerbMood = 'infinitive';

function pickWord(): WordWithParsing<VerbParsing> {
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
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

function InfinitiveVerbsPage() {
  return (
    <GameBase
      formatter={
        parsing => (
          [
            getTenseName(parsing.tense),
            getVoiceName(parsing.voice),
          ].join(' ')
        )
      }
      gameComponent={InfinitiveVerbs}
      numQuestions={10}
      pickWord={pickWord}
    />
  );
}

export default InfinitiveVerbsPage;
