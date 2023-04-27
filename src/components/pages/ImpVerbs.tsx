import {
  Box,
  Button,
  Divider,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Fragment, useCallback, useState } from 'react';
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

const PERSONS: VerbPerson[] = ['second', 'third'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];
const TENSES: VerbTense[] = ['present', 'aorist'];
const VOICES: VerbVoice[] = ['active', 'middle'];

const mood: VerbMood = 'imperative';

const COL_WIDTH = 140;
const COL_WIDTH_SM = 80;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

const NUM_QUESTIONS = 10;

function pickWord(): VerbWithParsing {
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
    ({ number, person, tense, voice } : {
      number: WordNumber,
      person: VerbPerson,
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
                  VOICES.map(voice => (
                    <Box
                      alignItems="center"
                      display="flex"
                      justifyContent="center"
                      minWidth={colWidth}
                      key={`${tense} ${voice}`}
                    >
                      <strong>
                        {(
                          sm
                            ? `${getTenseName(tense).slice(0, 4).replace(/[ieu]$/, '')}.`
                            : getTenseName(tense)
                        )}
                        <br />
                        {(
                          sm
                            ? `${getVoiceName(voice).slice(0, 3)}.`
                            : getVoiceName(voice)
                        )}
                      </strong>
                    </Box>
                  ))
                ))}
              </Stack>

              {NUMBERS.map(number => (
                <Fragment key={number}>
                  <Divider />

                  {PERSONS.map((person, i) => {
                    const numberName = getNumberName(number);
                    const personName = getPersonName(person);
                    const key = `${person}-${number}`;
                    return (
                      <Stack direction="row" spacing={2} key={key}>
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
                                  ? `${numberName.slice(0, numberName.length - 4)}.`
                                  : numberName
                              )}
                            </strong>
                          )}
                        </Box>

                        {TENSES.map(tense => (
                          VOICES.map(voice => {
                            const innerKey = `${key}-${tense}-${voice}`;
                            return (
                              <Button
                                key={innerKey}
                                onClick={() => checkAnswer({ number, person, tense, voice })}
                                size="large"
                                sx={{
                                  minWidth: colWidth,
                                }}
                                variant="outlined"
                              >
                                {sm ? personName.slice(0, 3) : personName}
                              </Button>
                            );
                          })
                        ))}
                      </Stack>
                    );
                  })}
                </Fragment>
              ))}
            </Stack>
          </>
        ) : (
          <StartGameDialog
            category="imperative"
            title="Imperative Verb Parsing"
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

export default ImperativeVerbs;
