import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import BackIcon from '@mui/icons-material/ChevronLeft';
import { Fragment, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import Timer from '../Timer';
import { getPage, PageId } from '.';
import StartGameDialog from '../StartGameDialog';

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

function MenuPage() {
  const [currentWord, setCurrentWord] = useState(pickWord());
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [report, setReport] = useState<Report<NounParsing>[]>([]);
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

export default MenuPage;
