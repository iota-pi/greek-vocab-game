import {
  Box,
  Button,
  Divider,
  Stack,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { Fragment, useCallback } from 'react';
import { declineNoun } from '../../decliner';
import type {
  Gender,
  NounCase,
  NounParsing,
  WordNumber,
  GameComponentProps,
} from '../../types';
import { getCaseName, getGenderName, getNumberName } from '../../util';

const CASES: NounCase[] = ['n', 'g', 'd', 'a'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];
const GENDERS: Gender[] = ['masculine', 'feminine', 'neuter'];

const COL_WIDTH = 140;
const COL_WIDTH_SM = 80;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

function Nouns({ currentWord, onAnswer }: GameComponentProps<NounParsing>) {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const colWidth = sm ? COL_WIDTH_SM : COL_WIDTH;
  const firstColWidth = sm ? FIRST_COL_WIDTH_SM : FIRST_COL_WIDTH;

  const checkAnswer = useCallback(
    ({
      nounCase,
      number,
      gender,
    }: {
      nounCase: NounCase,
      number: WordNumber,
      gender: Gender,
    }) => {
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

      onAnswer(correct, { gender, nounCase, number });
    },
    [currentWord, onAnswer],
  );

  return (
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
                      onClick={() => checkAnswer({ nounCase, number, gender })}
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
  );
}

export default Nouns;
