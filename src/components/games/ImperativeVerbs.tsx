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
import { getNumberName, getPersonName, getShortVoiceName, getTenseName, getVoiceName } from '../../util';
import { conjugateVerb } from '../../conjugater';

const mood: Verb.Mood = 'imperative';

const COL_WIDTH = 140;
const COL_WIDTH_SM = 80;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

function ImperativeVerbs({
  currentWord,
  onAnswer,
  params,
}: GameComponentProps<Verb.Data>) {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const colWidth = sm ? COL_WIDTH_SM : COL_WIDTH;
  const firstColWidth = sm ? FIRST_COL_WIDTH_SM : FIRST_COL_WIDTH;

  const checkAnswer = useCallback(
    (
      {
        number,
        person,
        tense,
        voice,
      }: Pick<Verb.Parsing, 'tense' | 'person' | 'number' | 'voice'>,
    ) => {
      const fullGuess: Verb.Parsing = {
        mood,
        number,
        person,
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

        {params.tense.map(tense => (
          params.voice.map(voice => (
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

                {params.tense.map(tense => (
                  params.voice.map(voice => {
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
