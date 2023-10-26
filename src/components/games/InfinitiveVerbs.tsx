import {
  Box,
  Button,
  Stack,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { useCallback } from 'react';
import type {
  Verb,
  WordNumber,
  GameComponentProps,
} from '../../types';
import { getShortVoiceName, getTenseName, getVoiceName } from '../../util';
import { conjugateVerb } from '../../conjugater';

const COL_WIDTH = 140;
const COL_WIDTH_SM = 100;
const FIRST_COL_WIDTH = 80;
const FIRST_COL_WIDTH_SM = 50;

const person: Verb.Person = 'first';
const number: WordNumber = 'singular';
const mood: Verb.Mood = 'infinitive';

function InfinitiveVerbs({
  currentWord,
  onAnswer,
  params,
}: GameComponentProps<Verb.Data>) {
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const colWidth = sm ? COL_WIDTH_SM : COL_WIDTH;
  const firstColWidth = sm ? FIRST_COL_WIDTH_SM : FIRST_COL_WIDTH;

  const checkAnswer = useCallback(
    ({ tense, voice }: Pick<Verb.Parsing, 'tense' | 'voice'>) => {
      const fullGuess: Verb.Parsing = {
        mood,
        number,
        person,
        tense,
        voice,
      };

      let correct = false;
      const declinedGuess = conjugateVerb({
        verb: currentWord.data,
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

        {params.tense.map(tense => (
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

      {params.voice.map((voice, i) => {
        const voiceName = sm ? getShortVoiceName(voice) : getVoiceName(voice);
        return (
          <Stack direction="row" spacing={2} key={voice}>
            <Box
              minWidth={firstColWidth}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {i === 0 && (
                <strong>
                  {voiceName}
                </strong>
              )}
            </Box>

            {params.tense.map(tense => {
              const tenseName = getTenseName(tense);
              const innerKey = `${voice}-${tense}`;
              return (
                <Button
                  key={innerKey}
                  onClick={() => checkAnswer({ tense, voice })}
                  size="large"
                  sx={{
                    minWidth: colWidth,
                  }}
                  variant="outlined"
                >
                  {sm ? tenseName.slice(0, 4).replace(/[ieu]$/, '') : tenseName}
                  {' '}
                  {voiceName}
                </Button>
              );
            })}
          </Stack>
        );
      })}
    </Stack>
  );
}

export default InfinitiveVerbs;
