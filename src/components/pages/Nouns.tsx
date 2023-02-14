import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import nouns from '../../data/nouns';
import { declineNoun, getGender } from '../../decliner';
import type { Gender, NounCase, WordNumber } from '../../types';
import { getGenderName } from '../../util';

const CASES: NounCase[] = ['n', 'g', 'd', 'a'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];
const GENDERS: Gender[] = ['masculine', 'feminine', 'neuter'];


type WordWithParsing = {
  word: string,
  nounCase: NounCase,
  gender: Gender,
  number: WordNumber,
};

function pickWord(): WordWithParsing {
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const gender = getGender(noun.word);
  const nounCase = CASES[Math.floor(Math.random() * CASES.length)];
  const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  const word = declineNoun({ noun: noun.word, nounCase, number });
  return {
    word,
    nounCase,
    number,
    gender,
  };
}

function MenuPage() {
  const [currentWord, setCurrentWord] = useState(pickWord());

  const getNewWord = useCallback(() => setCurrentWord(pickWord()), []);

  const checkAnswer = useCallback(
    (nounCase, number, gender) => {

    },
    [],
  );

  return (
    <Box padding={2}>
      <Stack spacing={4}>
        <Typography variant="h1">
          {currentWord.word}
        </Typography>

        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Box minWidth={100} />

            {GENDERS.map(gender => (
              <Box minWidth={100} key={gender}>
                {getGenderName(gender)}
              </Box>
            ))}
          </Stack>

          {NUMBERS.map(number => (
            CASES.map(nounCase => (
              GENDERS.map(gender => {
                const key = `${nounCase}${number}${gender}`
                return (
                  <Button
                    key={key}
                    onClick={() => checkAnswer(nounCase, number, gender)}
                    size="large"
                    variant="outlined"
                  >
                    Nouns
                  </Button>
                );
              })
            ))
          ))}
        </Stack>

      </Stack>
    </Box>
  );
}

export default MenuPage;
