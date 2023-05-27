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
  VerbMood,
  VerbVoice,
  GameComponentProps,
} from '../../types';
import { getNumberName, getPersonName, getShortVoiceName, getTenseName, getVoiceName } from '../../util';
import { conjugateVerb } from '../../conjugater';

const PERSONS: VerbPerson[] = ['second', 'third'];
const NUMBERS: WordNumber[] = ['singular', 'plural'];
const TENSES: VerbTense[] = ['present', 'aorist'];
const VOICES: VerbVoice[] = ['active', 'middle'];

const mood: VerbMood = 'imperative';

const COL_WIDTH = 140;
const COL_WIDTH_SM = 80;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

function ImperativeVerbs({ currentWord, onAnswer }: GameComponentProps<VerbParsing>) {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const colWidth = sm ? COL_WIDTH_SM : COL_WIDTH;
  const firstColWidth = sm ? FIRST_COL_WIDTH_SM : FIRST_COL_WIDTH;

  const checkAnswer = useCallback(
    ({ number, person, tense, voice } : {
      number: WordNumber,
      person: VerbPerson,
      tense: VerbTense,
      voice: VerbVoice,
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
        ...fullGuess,
        verb: currentWord.lexical,
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
          VOICES.map(voice => (
            <Box
              alignItems="center"
              display="flex"
              fontWeight={700}
              justifyContent="center"
              key={`${tense} ${voice}`}
              minWidth={colWidth}
              textAlign="center"
            >
              {(
                sm
                  ? `${getTenseName(tense).slice(0, 4).replace(/[ieu]$/, '')}.`
                  : getTenseName(tense)
              )}
              <br />
              {(
                sm
                  ? `${getShortVoiceName(voice)}`
                  : getVoiceName(voice)
              )}
            </Box>
          ))
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

                {TENSES.map(tense => (
                  VOICES.map(voice => {
                    const innerKey = `${key}-${tense}-${voice}`;
                    return (
                      <Button
                        key={innerKey}
                        onClick={() => checkAnswer({ number, person, tense, voice })}
                        size="large"
                        sx={{
                          minWidth: colWidth,
                        }}
                        variant="outlined"
                      >
                        {sm ? personName.slice(0, 3) : personName}
                      </Button>
                    );
                  })
                ))}
              </Stack>
            );
          })}
        </Fragment>
      ))}
    </Stack>
  );
}

export default ImperativeVerbs;
