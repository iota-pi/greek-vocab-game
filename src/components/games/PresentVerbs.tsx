import {
  Box,
  Button,
  Divider,
  Stack,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { Fragment, useCallback } from 'react';
import type {
  Verb,
  GameComponentProps,
} from '../../types';
import { getNumberName, getPersonName } from '../../util';
import { conjugateVerb } from '../../conjugater';

const COL_WIDTH = 140;
const COL_WIDTH_SM = 80;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

function PresentVerbs({
  currentWord,
  onAnswer,
  params,
}: GameComponentProps<Verb.Data>) {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const colWidth = sm ? COL_WIDTH_SM : COL_WIDTH;
  const firstColWidth = sm ? FIRST_COL_WIDTH_SM : FIRST_COL_WIDTH;

  const checkAnswer = useCallback(
    ({ person, number }: Pick<Verb.Parsing, 'person' | 'number'>) => {
      const tense = 'present';
      const mood = 'indicative';
      const voice = 'active';
      const fullGuess: Verb.Parsing = {
        person,
        number,
        mood,
        tense,
        voice,
      };

      let correct = false;
      const declinedGuess = conjugateVerb({
        ...fullGuess,
        verb: currentWord.data,
      });
      if (declinedGuess === currentWord.word) {
        correct = true;
      }

      onAnswer(correct, fullGuess);
    },
    [currentWord, onAnswer],
  );

  return (
    <Stack spacing={2} pt={2}>
      <Stack direction="row" spacing={2}>
        <Box minWidth={firstColWidth} />
      </Stack>

      {params.number.map(number => (
        <Fragment key={number}>
          <Divider />

          {params.person.map((person, i) => {
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
                  onClick={() => checkAnswer({ person, number })}
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
  );
}

export default PresentVerbs;
