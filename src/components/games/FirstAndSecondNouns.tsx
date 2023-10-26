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
  Noun,
  GameComponentProps,
} from '../../types';
import { getCaseName, getGenderName, getNumberName } from '../../util';

const COL_WIDTH = 140;
const COL_WIDTH_SM = 80;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

function FirstAndSecondNouns(
  {
    currentWord,
    onAnswer,
    params,
  }: GameComponentProps<Noun.Data>,
) {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const colWidth = sm ? COL_WIDTH_SM : COL_WIDTH;
  const firstColWidth = sm ? FIRST_COL_WIDTH_SM : FIRST_COL_WIDTH;

  const checkAnswer = useCallback(
    ({ nounCase, number, gender }: Noun.Parsing) => {
      let correct = false;
      const declinedGuess = declineNoun({
        noun: currentWord.data,
        nounCase,
        number,
      });
      if (
        gender === currentWord.parsing.gender
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

        {params.gender.map(gender => (
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

      {params.number.map(number => (
        <Fragment key={number}>
          <Divider />

          {params.nounCase.map((nounCase, i) => {
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

                {params.gender.map(gender => {
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

export default FirstAndSecondNouns;
