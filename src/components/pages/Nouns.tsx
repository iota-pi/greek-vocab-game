import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Fragment, useCallback, useState } from 'react';
import { default as CheckIcon } from '@mui/icons-material/Check';
import { default as CrossIcon } from '@mui/icons-material/Close';
import nouns from '../../data/nouns';
import { declineNoun, getGender } from '../../decliner';
import type { Gender, NounCase, WordNumber } from '../../types';
import { getCaseName, getGenderName, getNumberName } from '../../util';
import Timer from '../Timer';
import HighScores from '../../HighScores';

const CASES: NounCase[] = ['n', 'g', 'd', 'a'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];
const GENDERS: Gender[] = ['masculine', 'feminine', 'neuter'];

const ROW_WIDTH = 150;

const NUM_QUESTIONS = 20;

type Parsing = {
  nounCase: NounCase,
  gender: Gender,
  number: WordNumber,
}

type WordWithParsing = Parsing & {
  word: string,
  lexical: string,
};

type Report = {
  word: string,
  correct: boolean,
  expected: Parsing,
  given: Parsing,
}

function pickWord(): WordWithParsing {
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
  const [report, setReport] = useState<Report[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

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

      const newReport: Report = {
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
      <Stack spacing={2}>
        <Button
          variant="outlined"
          onClick={handleRestart}
        >
          Restart
        </Button>

        <div>
          <div>
            Score: {score} / {total}
          </div>

          <div>
            {startTime && (
              <span>
                Time: <Timer startTime={startTime} endTime={endTime} />
              </span>
            )}
          </div>

          <div>
            Remaining: {NUM_QUESTIONS - total}
          </div>
        </div>

        <Divider />

        {gameActive ? (
          <>
            <Typography variant="h1">
              {currentWord.word}
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Box minWidth={ROW_WIDTH} />

                {GENDERS.map(gender => (
                  <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                    minWidth={ROW_WIDTH}
                    key={gender}
                  >
                    <strong>{getGenderName(gender)}</strong>
                  </Box>
                ))}
              </Stack>

              {NUMBERS.map(number => (
                <Fragment key={number}>
                  <Divider />

                  {CASES.map((nounCase, i) => (
                    <Stack direction="row" spacing={2} key={`${nounCase}${number}`}>
                      <Box
                        minWidth={ROW_WIDTH}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {i === 0 && (
                          <strong>{getNumberName(number)}</strong>
                        )}
                      </Box>

                      {GENDERS.map(gender => {
                        const key = `${nounCase}${number}${gender}`
                        return (
                          <Button
                            key={key}
                            onClick={() => checkAnswer(nounCase, number, gender)}
                            size="large"
                            variant="outlined"
                            sx={{
                              minWidth: ROW_WIDTH,
                            }}
                          >
                            {getCaseName(nounCase)}
                          </Button>
                        );
                      })}
                    </Stack>
                  ))}
                </Fragment>
              ))}
            </Stack>
          </>
        ) : (
          <Dialog
            open={true}
          >
            <DialogContent>
              <Stack spacing={2}>
                <Typography variant="h3">
                  Greek Noun Parsing
                </Typography>
                <Button
                  onClick={handleStart}
                  variant="contained"
                >
                  Start
                </Button>

                {report.length > 0 && (
                  <>
                    <Divider />

                    <div>
                      <Typography
                        component="div"
                        color={score === total ? 'success.main' : 'warning.main'}
                        fontWeight={400}
                        textAlign="center"
                        variant="h5"
                      >
                        {score} / {total}
                      </Typography>

                      <Typography
                        textAlign="center"
                        variant="h5"
                      >
                        {startTime && (
                          <Timer startTime={startTime} endTime={endTime} />
                        )}
                      </Typography>
                    </div>

                    <List dense>
                      {report.map(({ correct, given, expected, word }, i) => (
                        <ListItem key={`reportItem-${i}`}>
                          <ListItemIcon>
                            {(
                              correct
                                ? <CheckIcon color="success" />
                                : <CrossIcon color="error" />
                            )}
                          </ListItemIcon>

                          <ListItemText
                            primary={(
                              `${word} — ${getCaseName(given.nounCase)} `
                              + `${getNumberName(given.number)} ${getGenderName(given.gender)}`
                            )}
                            secondary={correct ? '' : (
                              `Expected: ${getCaseName(expected.nounCase)} `
                              + `${getNumberName(expected.number)} ${getGenderName(expected.gender)}`
                            )}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                <HighScores
                  category="nouns"
                  canSubmit={report.length > 0}
                />
              </Stack>
            </DialogContent>
          </Dialog>
        )}

        <Divider />
      </Stack>
    </Box>
  );
}

export default MenuPage;
