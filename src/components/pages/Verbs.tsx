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
import { useHistory } from 'react-router-dom';
import verbs from '../../data/verbs';
import type {
  VerbPerson,
  VerbWithParsing,
  Report,
  WordNumber,
  VerbParsing,
} from '../../types';
import { getCaseName, getGenderName, getNumberName, getPersonName } from '../../util';
import Timer from '../Timer';
import { getPage, PageId } from '.';
import StartGameDialog from '../StartGameDialog';
import { conjugateVerb } from '../../conjugater';

const PERSONS: VerbPerson[] = ['first', 'second', 'third'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];

const COL_WIDTH = 140;
const COL_WIDTH_SM = 80;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

const NUM_QUESTIONS = 20;

function pickWord(): VerbWithParsing {
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const person = PERSONS[Math.floor(Math.random() * PERSONS.length)];
  let number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  try {
    const word = conjugateVerb({ verb: verb.word, person, number });
    return {
      word,
      lexical: verb.word,
      person,
      number,
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

function MenuPage() {
  const [currentWord, setCurrentWord] = useState(pickWord());
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [report, setReport] = useState<Report<VerbParsing>[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const history = useHistory();

  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const colWidth = sm ? COL_WIDTH_SM : COL_WIDTH;
  const firstColWidth = sm ? FIRST_COL_WIDTH_SM : FIRST_COL_WIDTH;

  const goTo = useCallback(
    (pageId: PageId) => {
      const page = getPage(pageId);
      history.push(page.path);
    },
    [history],
  );

  const getNewWord = useCallback(() => setCurrentWord(pickWord()), []);

  const checkAnswer = useCallback(
    (person: VerbPerson, number: WordNumber) => {
      let correct = false;
      const declinedGuess = conjugateVerb({
        verb: currentWord.lexical,
        person,
        number,
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
          number,
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
    },
    [],
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

                        <Button
                          onClick={() => checkAnswer(person, number)}
                          size="large"
                          variant="outlined"
                          sx={{
                            minWidth: colWidth,
                          }}
                        >
                          {sm ? personName.slice(0, 3) : personName}
                        </Button>
                      </Stack>
                    );
                  })}
                </Fragment>
              ))}
            </Stack>
          </>
        ) : (
          <StartGameDialog
            category='verbs'
            title="Present Verb Parsing"
            onStart={handleStart}
            report={report}
            endTime={endTime}
            startTime={startTime}
            formatter={(
              parsing => (
                [
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

export default MenuPage;
