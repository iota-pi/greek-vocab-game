import {
  Box,
  Button,
  Divider,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useCallback, useState } from 'react';
import verbs from '../../data/verbs';
import type {
  VerbPerson,
  VerbWithParsing,
  Report,
  WordNumber,
  VerbParsing,
  VerbTense,
  VerbMood,
  VerbVoice,
} from '../../types';
import { getNumberName, getPersonName, getTenseName, getVoiceName } from '../../util';
import Timer from '../Timer';
import StartGameDialog from '../StartGameDialog';
import { conjugateVerb } from '../../conjugater';

const TENSES: VerbTense[] = ['present', 'aorist'];
const VOICES: VerbVoice[] = ['active', 'middle'];

const COL_WIDTH = 140;
const COL_WIDTH_SM = 100;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

const NUM_QUESTIONS = 10;

const person: VerbPerson = 'first';
const number: WordNumber = 'singular';
const mood: VerbMood = 'infinitive';

function pickWord(): VerbWithParsing {
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

function InfinitiveVerbs() {
  const [currentWord, setCurrentWord] = useState(pickWord());
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [report, setReport] = useState<Report<VerbParsing>[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const colWidth = sm ? COL_WIDTH_SM : COL_WIDTH;
  const firstColWidth = sm ? FIRST_COL_WIDTH_SM : FIRST_COL_WIDTH;

  const getNewWord = useCallback(
    () => setCurrentWord(
      prev => {
        let word = pickWord();
        for (let i = 0; i < 3 && word === prev; ++i) {
          word = pickWord();
        }
        return word;
      },
    ),
    [],
  );

  const checkAnswer = useCallback(
    ({ tense, voice } : {
      tense: VerbTense,
      voice: VerbVoice,
    }) => {
      let correct = false;
      const declinedGuess = conjugateVerb({
        mood,
        number,
        person,
        tense,
        verb: currentWord.lexical,
        voice,
      });
      if (declinedGuess === currentWord.word) {
        correct = true;
      }

      setTotal(t => t + 1);
      if (correct) {
        setScore(s => s + 1);
      }

      const newReport: Report<VerbParsing> = {
        word: currentWord.word,
        correct,
        expected: { ...currentWord },
        given: {
          mood,
          person,
          number,
          tense,
          voice,
        },
      };
      setReport(r => [...r, newReport]);

      if (total + 1 >= NUM_QUESTIONS) {
        setEndTime(new Date());
      }

      getNewWord();
    },
    [currentWord, getNewWord, total],
  );

  const handleStart = useCallback(
    () => {
      setReport([]);
      setScore(0);
      setTotal(0);
      setStartTime(new Date());
      setEndTime(null);
      getNewWord();
    },
    [getNewWord],
  );

  const handleRestart = useCallback(
    () => setEndTime(new Date()),
    [],
  );

  const gameActive = !!startTime && !endTime;

  return (
    <Box padding={2}>
      <Stack alignItems="center">

        <Box
          display="flex"
          alignItems="center"
          width="100%"
        >
          <Box flex={1}>
            Score: {score} / {total} ({NUM_QUESTIONS - total} remaining)
          </Box>

          <Box
            display="flex"
            flex={1}
            justifyContent="center"
          >
            {startTime && (
              <span>
                Time: <Timer startTime={startTime} endTime={endTime} />
              </span>
            )}
          </Box>

          <Box
            display="flex"
            flex={1}
            justifyContent="flex-end"
          >
            <Button
              onClick={handleRestart}
              variant="outlined"
            >
              Restart
            </Button>
          </Box>
        </Box>

        <Divider />

        {gameActive ? (
          <>
            <Typography
              variant="h2"
              textAlign="center"
              py={2}
            >
              {currentWord.word}
            </Typography>

            <Stack spacing={2} pt={2}>
              <Stack direction="row" spacing={2}>
                <Box minWidth={firstColWidth} />

                {TENSES.map(tense => (
                  <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                    minWidth={colWidth}
                    key={tense}
                  >
                    <strong>
                      {(
                        sm
                          ? `${getTenseName(tense).slice(0, 4).replace(/[ieu]$/, '')}.`
                          : getTenseName(tense)
                      )}
                    </strong>
                  </Box>
                ))}
              </Stack>

              {VOICES.map((voice, i) => {
                const voiceName = getVoiceName(voice);
                return (
                  <Stack direction="row" spacing={2} key={voice}>
                    <Box
                      minWidth={firstColWidth}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {i === 0 && (
                        <strong>
                          {(
                            sm
                              ? `${voiceName.slice(0, 3)}.`
                              : voiceName
                          )}
                        </strong>
                      )}
                    </Box>

                    {TENSES.map(tense => {
                      const tenseName = getTenseName(tense);
                      const innerKey = `${voice}-${tense}`;
                      return (
                        <Button
                          key={innerKey}
                          onClick={() => checkAnswer({ tense, voice })}
                          size="large"
                          sx={{
                            minWidth: colWidth,
                          }}
                          variant="outlined"
                        >
                          {sm ? tenseName.slice(0, 4).replace(/[ieu]$/, '') : tenseName}
                          {' '}
                          {sm ? voiceName.slice(0, 3) : voiceName}
                        </Button>
                      );
                    })}
                  </Stack>
                );
              })}
            </Stack>
          </>
        ) : (
          <StartGameDialog
            category="infinitive"
            title="Infinitive Verb Parsing"
            onStart={handleStart}
            report={report}
            endTime={endTime}
            startTime={startTime}
            formatter={(
              parsing => (
                [
                  getTenseName(parsing.tense),
                  getPersonName(parsing.person),
                  getNumberName(parsing.number),
                ].join(' ')
              )
            )}
            score={score}
            total={total}
          />
        )}

        <Divider />
      </Stack>
    </Box>
  );
}

export default InfinitiveVerbs;
