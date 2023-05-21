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
import nouns from '../../data/nouns';
import { declineNoun, getGender } from '../../decliner';
import type {
  Gender,
  NounCase,
  NounParsing,
  NounWithParsing,
  Report,
  WordNumber,
} from '../../types';
import { getCaseName, getGenderName, getNumberName } from '../../util';
import StartGameDialog from '../StartGameDialog';
import GameHeader from '../GameHeader';

const CASES: NounCase[] = ['n', 'g', 'd', 'a'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];
const GENDERS: Gender[] = ['masculine', 'feminine', 'neuter'];

const COL_WIDTH = 140;
const COL_WIDTH_SM = 80;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

const NUM_QUESTIONS = 20;

function pickWord(): NounWithParsing {
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

function Nouns() {
  const [currentWord, setCurrentWord] = useState(pickWord());
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [report, setReport] = useState<Report<NounParsing>[]>([]);
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
    (nounCase: NounCase, number: WordNumber, gender: Gender) => {
      let correct = false;
      const declinedGuess = declineNoun({
        noun: currentWord.lexical,
        nounCase,
        number,
      });
      if (
        gender === currentWord.gender
        && declinedGuess === currentWord.word
      ) {
        correct = true;
      }

      // Handle special ambiguous cases
      if (
        currentWord.word === 'οἰκων'
        && declinedGuess === currentWord.word
        && gender !== 'neuter'
      ) {
        correct = true;
      }

      setTotal(t => t + 1);
      if (correct) {
        setScore(s => s + 1);
      }

      const newReport: Report<NounParsing> = {
        word: currentWord.word,
        correct,
        expected: { ...currentWord },
        given: {
          nounCase,
          number,
          gender,
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
      <GameHeader
        endTime={endTime}
        questionsInQuiz={NUM_QUESTIONS}
        onRestart={handleRestart}
        score={score}
        startTime={startTime}
        total={total}
      />

      <Stack alignItems="center">
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

                {GENDERS.map(gender => (
                  <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                    minWidth={colWidth}
                    key={gender}
                  >
                    <strong>
                      {(
                        sm
                          ? `${getGenderName(gender).slice(0, 4).replace(/i$/, '')}.`
                          : getGenderName(gender)
                      )}
                    </strong>
                  </Box>
                ))}
              </Stack>

              {NUMBERS.map(number => (
                <Fragment key={number}>
                  <Divider />

                  {CASES.map((nounCase, i) => {
                    const numberName = getNumberName(number);
                    return (
                      <Stack direction="row" spacing={2} key={`${nounCase}${number}`}>
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

                        {GENDERS.map(gender => {
                          const key = `${nounCase}${number}${gender}`;
                          const caseName = getCaseName(nounCase);
                          return (
                            <Button
                              key={key}
                              onClick={() => checkAnswer(nounCase, number, gender)}
                              size="large"
                              variant="outlined"
                              sx={{
                                minWidth: colWidth,
                              }}
                            >
                              {sm ? caseName.slice(0, 3) : caseName}
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
            category="nouns"
            title="Greek Noun Parsing"
            onStart={handleStart}
            report={report}
            endTime={endTime}
            startTime={startTime}
            formatter={(
              parsing => (
                [
                  getCaseName(parsing.nounCase),
                  getNumberName(parsing.number),
                  getGenderName(parsing.gender),
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

export default Nouns;
