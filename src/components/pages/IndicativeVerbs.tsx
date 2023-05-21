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
} from '../../types';
import { getNumberName, getPersonName, getTenseName } from '../../util';
import StartGameDialog from '../StartGameDialog';
import { conjugateVerb } from '../../conjugater';
import GameHeader from '../GameHeader';

const PERSONS: VerbPerson[] = ['first', 'second', 'third'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];
const TENSES: VerbTense[] = ['present', 'imperfect', 'aorist', 'future'];

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

function IndicativeVerbs() {
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
    (tense: VerbTense, person: VerbPerson, number: WordNumber) => {
      const mood = 'indicative';
      const voice = 'active';

      let correct = false;
      const declinedGuess = conjugateVerb({
        verb: currentWord.lexical,
        mood,
        number,
        person,
        tense,
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
          person,
          mood,
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
        <GameHeader
          endTime={endTime}
          questionsInQuiz={NUM_QUESTIONS}
          onRestart={handleRestart}
          score={score}
          startTime={startTime}
          total={total}
        />

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
                    fontWeight={700}
                    justifyContent="center"
                    key={tense}
                    minWidth={colWidth}
                    textAlign="center"
                  >
                    {(
                      sm
                        ? `${getTenseName(tense).slice(0, 4).replace(/[ieu]$/, '')}.`
                        : getTenseName(tense)
                    )}
                  </Box>
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

                        {TENSES.map(tense => {
                          const innerKey = `${key}-${tense}`;
                          return (
                            <Button
                              key={innerKey}
                              onClick={() => checkAnswer(tense, person, number)}
                              size="large"
                              sx={{
                                minWidth: colWidth,
                              }}
                              variant="outlined"
                            >
                              {sm ? personName.slice(0, 3) : personName}
                            </Button>
                          );
                        })}
                      </Stack>
                    );
                  })}
                </Fragment>
              ))}
            </Stack>
          </>
        ) : (
          <StartGameDialog
            category="indicative"
            title="Indicative Verb Parsing"
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

export default IndicativeVerbs;
