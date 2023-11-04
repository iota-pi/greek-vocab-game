import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { MouseEvent, useCallback } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Verb } from '../../types';
import { ALL_MOODS, ALL_TENSES, ALL_VOICES, CATEGORY_MAP, StudyCategory, getMoodName, getTenseName, getVoiceName } from '../../util';
import { useHistory } from 'react-router';
import { getPage } from '.';


function GameCustomisation() {
  const history = useHistory();

  const [category, setCategory] = useLocalStorage<StudyCategory>('study-category', 'noun');
  const handleChangeCategory = useCallback(
    (event: MouseEvent<HTMLElement>, newCategory: string | null) => {
      if (newCategory && CATEGORY_MAP.hasOwnProperty(newCategory)) {
        setCategory(newCategory as StudyCategory);
      }
    },
    [],
  );

  const [moods, setMoods] = useLocalStorage<Verb.Mood[]>('study-moods', []);
  const handleChangeMoods = useCallback(
    (event: MouseEvent<HTMLElement>, newMoods: string[]) => {
      setMoods(newMoods as Verb.Mood[]);
    },
    [],
  );
  const handleClickAllMoods = useCallback(
    () => {
      setMoods(oldMoods => (
        oldMoods.length === ALL_MOODS.length ? [] : ALL_MOODS.slice()
      ));
    },
    [],
  );

  const [tenses, setTenses] = useLocalStorage<Verb.Tense[]>('study-tenses', []);
  const handleChangeTenses = useCallback(
    (event: MouseEvent<HTMLElement>, newTenses: string[]) => {
      setTenses(newTenses as Verb.Tense[]);
    },
    [],
  );
  const handleClickAllTenses = useCallback(
    () => {
      setTenses(oldTenses => (
        oldTenses.length === ALL_TENSES.length ? [] : ALL_TENSES.slice()
      ));
    },
    [],
  );

  const [voices, setVoices] = useLocalStorage<Verb.Voice[]>('study-voices', []);
  const handleChangeVoices = useCallback(
    (event: MouseEvent<HTMLElement>, newVoices: string[]) => {
      setVoices(newVoices as Verb.Voice[]);
    },
    [],
  );
  const handleClickAllVoices = useCallback(
    () => {
      setVoices(oldVoices => (
        oldVoices.length === ALL_VOICES.length ? [] : ALL_VOICES.slice()
      ));
    },
    [],
  );

  const handleClickStart = useCallback(
    () => {
      history.push(getPage('practice').path);
    },
    [],
  );

  return (
    <Box
      padding={2}
      justifyContent="center"
      display="flex"
    >
      <Stack spacing={2} maxWidth={600}>
        <Typography
          variant="h2"
          textAlign="center"
          pt={4}
        >
          Customise study
        </Typography>

        <ToggleButtonGroup
          aria-label="study category"
          exclusive
          onChange={handleChangeCategory}
          value={category}
        >
          <ToggleButton value="noun" aria-label="nouns">
            Nouns
          </ToggleButton>
          <ToggleButton value="verb" aria-label="verbs">
            Verbs
          </ToggleButton>
        </ToggleButtonGroup>

        <Box display="flex">
          <Box mr={1}>
            <ToggleButton
              onClick={handleClickAllMoods}
              value="all"
              aria-label="all"
              selected={moods.length === ALL_MOODS.length && category === 'verb'}
              disabled={category !== 'verb'}
            >
              All
            </ToggleButton>
          </Box>

          <ToggleButtonGroup
            aria-label="moods"
            onChange={handleChangeMoods}
            value={moods}
            disabled={category !== 'verb'}
            fullWidth
          >
            {ALL_MOODS.map(mood => (
              <ToggleButton
                key={mood}
                value={mood}
                aria-label={mood}
                selected={moods.includes(mood) && category === 'verb'}
              >
                {getMoodName(mood)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box display="flex">
          <Box mr={1}>
            <ToggleButton
              onClick={handleClickAllVoices}
              value="all"
              aria-label="all"
              selected={voices.length === ALL_VOICES.length && category === 'verb'}
              disabled={category !== 'verb'}
            >
              All
            </ToggleButton>
          </Box>

          <ToggleButtonGroup
            aria-label="voices"
            onChange={handleChangeVoices}
            value={voices}
            disabled={category !== 'verb'}
            fullWidth
          >
            {ALL_VOICES.map(voice => (
              <ToggleButton
                key={voice}
                value={voice}
                aria-label={voice}
                selected={voices.includes(voice) && category === 'verb'}
              >
                {getVoiceName(voice)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box display="flex">
          <Box mr={1}>
            <ToggleButton
              onClick={handleClickAllTenses}
              value="all"
              aria-label="all"
              selected={tenses.length === ALL_TENSES.length && category === 'verb'}
              disabled={category !== 'verb'}
            >
              All
            </ToggleButton>
          </Box>

          <ToggleButtonGroup
            aria-label="tenses"
            onChange={handleChangeTenses}
            value={tenses}
            disabled={category !== 'verb'}
            fullWidth
          >
            {ALL_TENSES.map(tense => (
              <ToggleButton
                key={tense}
                value={tense}
                aria-label={tense}
                selected={tenses.includes(tense) && category === 'verb'}
              >
                {getTenseName(tense)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* TODO: noun/verb root category customisation */}

        <Button
          onClick={handleClickStart}
        >
          Start
        </Button>
      </Stack>
    </Box>
  );
}

export default GameCustomisation;
