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
  VerbPerson,
  WordNumber,
  VerbParsing,
  VerbTense,
  GameComponentProps,
} from '../../types';
import { getNumberName, getPersonName, getTenseName } from '../../util';
import { conjugateVerb } from '../../conjugater';

const PERSONS: VerbPerson[] = ['first', 'second', 'third'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];
const TENSES: VerbTense[] = ['present', 'imperfect', 'aorist', 'future'];
const mood = 'indicative';
const voice = 'active';

const COL_WIDTH = 140;
const COL_WIDTH_SM = 80;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

function IndicativeVerbs({ currentWord, onAnswer }: GameComponentProps<VerbParsing>) {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const colWidth = sm ? COL_WIDTH_SM : COL_WIDTH;
  const firstColWidth = sm ? FIRST_COL_WIDTH_SM : FIRST_COL_WIDTH;

  const checkAnswer = useCallback(
    ({
      tense,
      person,
      number,
    }: {
      tense: VerbTense,
      person: VerbPerson,
      number: WordNumber,
    }) => {
      const fullGuess: VerbParsing = {
        mood,
        number,
        person,
        tense,
        voice,
      };

      let correct = false;
      const declinedGuess = conjugateVerb({
        verb: currentWord.lexical,
        ...fullGuess,
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
                      onClick={() => checkAnswer({ tense, person, number })}
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
  );
}

export default IndicativeVerbs;
