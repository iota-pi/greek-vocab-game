import { Noun, Parsing, Report, Verb, WordData, WordWithParsing } from '../../types';
import { useLocalStorage } from 'usehooks-ts';
import { ALL_CASES, ALL_GENDERS, ALL_MOODS, ALL_NUMBERS, ALL_PERSONS, ALL_TENSES, ALL_VOICES, StudyCategory, checkParsing, getCaseName, getGenderName, getMoodName, getNumberName, getPersonName, getPickNoun, getPickVerb, getTenseName, getVoiceName, isNoun, isVerb } from '../../util';
import { getGeneralFormatter } from '../formatter';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import nouns from '../../data/nouns';
import verbs from '../../data/verbs';
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import ReportDisplay from '../ReportDisplay';

export type ParsingPart = keyof Noun.Parsing | keyof Verb.Parsing;
export type CombinedParsing = {
  [k in ParsingPart]: (
    k extends keyof Noun.Parsing
      ? Noun.Parsing[k]
      : (k extends keyof Verb.Parsing ? Verb.Parsing[k] : never)
  );
}
export type CombinedParsingWithNulls = {
  [k in ParsingPart]: CombinedParsing[k] | null;
}
export const PART_MAPPING: {
  [k in ParsingPart]: CombinedParsing[k][];
} = {
  nounCase: ALL_CASES,
  gender: ALL_GENDERS,
  mood: ALL_MOODS,
  number: ALL_NUMBERS,
  person: ALL_PERSONS,
  tense: ALL_TENSES,
  voice: ALL_VOICES,
};
export const PART_NAME_MAPPING: {
  [k in ParsingPart]: (value: CombinedParsing[k]) => string;
} = {
  gender: getGenderName,
  mood: getMoodName,
  nounCase: getCaseName,
  number: getNumberName,
  person: getPersonName,
  tense: getTenseName,
  voice: getVoiceName,
};
export const ALL_PARTS: ParsingPart[] = [
  'tense',
  'voice',
  'mood',
  'person',
  'number',
  'gender',
  'nounCase',
];
const BLANK_PARSING: CombinedParsingWithNulls = {
  gender: null,
  mood: null,
  nounCase: null,
  number: null,
  person: null,
  tense: null,
  voice: null,
};

function getPartName<T extends ParsingPart>(
  part: T,
  value: CombinedParsing[T],
) {
  return PART_NAME_MAPPING[part](value);
}

export function isValidParsing(parsing: CombinedParsing) {
  if (parsing.mood === 'participle') {
    if (parsing.person !== 'first') {
      return false;
    }
  } else {
    if (parsing.nounCase !== 'n') {
      return false;
    }
    if (parsing.gender !== 'masculine') {
      return false;
    }
  }
  if (parsing.mood === 'infinitive') {
    if (parsing.person !== 'first') {
      return false;
    }
    if (parsing.number !== 'singular') {
      return false;
    }
  }
  if (parsing.mood === 'imperative') {
    if (parsing.person === 'first') {
      return false;
    }
  }
  return true;
}

function CustomGamePage() {
  const [category] = useLocalStorage<StudyCategory>('study-category', 'noun');
  const [moods] = useLocalStorage<Verb.Mood[]>('study-moods', []);
  const [tenses] = useLocalStorage<Verb.Tense[]>('study-tenses', []);
  const [voices] = useLocalStorage<Verb.Voice[]>('study-voices', []);

  const [report, setReport] = useState<Report<WordData>[]>([]);

  const pickWord = useCallback(
    () => {
      if (category === 'noun') {
        return getPickNoun({
          noun: nouns,
          nounCase: ALL_CASES,
          number: ALL_NUMBERS,
        });
      } else {
        return getPickVerb({
          verb: verbs,
          mood: moods,
          number: ALL_NUMBERS,
          person: ALL_PERSONS,
          tense: tenses,
          voice: voices,
          gender: ALL_GENDERS,
          nounCase: ALL_CASES,
        });
      }
    },
    [category, moods, tenses, voices],
  );

  const [currentWord, setCurrentWord] = (
    useState<WordWithParsing<Noun.Data> | WordWithParsing<Verb.Data>>(pickWord())
  );
  const [parsingInfo, setParsingInfo] = useState<CombinedParsingWithNulls>({ ...BLANK_PARSING });

  const applicableParts = useMemo(
    (): ParsingPart[] => {
      if (!currentWord) {
        return [];
      }
      if (isNoun(currentWord)) {
        return ['gender', 'nounCase', 'number'];
      } else if (isVerb(currentWord)) {
        let parts: ParsingPart[] = ['tense', 'voice', 'mood', 'person', 'number'];
        if (parsingInfo.mood === 'infinitive') {
          parts = parts.filter(p => !['person', 'number'].includes(p));
        }
        if (parsingInfo.mood === 'participle') {
          parts.push('nounCase', 'gender');
          parts = parts.filter(p => p !== 'person');
        }
        // TODO: disable first person for imperatives
        return parts;
      }
      throw new Error(`Unknown word type ${JSON.stringify(currentWord)}`);
    },
    [currentWord, parsingInfo],
  );

  const handleTogglePart = useCallback(
    <T extends ParsingPart>(part: T) => {
      return (event: MouseEvent<HTMLElement>, newData: CombinedParsing[T]) => {
        if (newData) {
          setParsingInfo(pi => ({
            ...pi,
            [part]: newData,
          }));
        }
      };
    },
    [],
  );

  const getNewWord = useCallback(
    () => {
      setCurrentWord(pickWord());
      setParsingInfo({ ...BLANK_PARSING });
    },
    [pickWord],
  );

  const getAllPossibleParsings = useCallback(
    () => {
      const results: CombinedParsing[] = [];

      const totalOptions = ALL_PARTS.reduce(
        (total, part) => total * PART_MAPPING[part].length,
        1,
      );
      const tempParsing: CombinedParsing = {
        nounCase: ALL_CASES[0],
        gender: ALL_GENDERS[0],
        mood: ALL_MOODS[0],
        number: ALL_NUMBERS[0],
        person: ALL_PERSONS[0],
        tense: ALL_TENSES[0],
        voice: ALL_VOICES[0],
      };
      for (let i = 0; i < totalOptions; ++i) {
        let temp = i;
        for (let j = 0; j < ALL_PARTS.length && temp > 0; ++j) {
          const part = ALL_PARTS[j];
          const index = temp % PART_MAPPING[part].length;
          (tempParsing as Record<ParsingPart, string>)[part] = PART_MAPPING[part][index];
          temp = Math.floor(temp / PART_MAPPING[part].length);
        }
        if (!isValidParsing(tempParsing)) {
          continue;
        }

        const toCheck: WordWithParsing<WordData> = {
          data: currentWord.data,
          parsing: tempParsing,
          word: currentWord.word,
        }
        if (checkParsing(toCheck, currentWord.word)) {
          results.push({ ...tempParsing });
        }
      }

      return results;
    },
    [currentWord],
  );

  const handleClickCheck = useCallback(
    () => {
      const possibleParsings = getAllPossibleParsings();
      let correct = false;
      for (const parsing of possibleParsings) {
        correct = applicableParts.every(
          part => parsingInfo[part] === parsing[part]
        );
        if (correct) {
          break;
        }
      }
      const newReport: Report<WordData> = {
        word: currentWord.word,
        correct,
        expected: possibleParsings,
        given: (parsingInfo as CombinedParsing),
      };

      setReport(r => [newReport, ...r]);
      getNewWord();
    },
    [applicableParts, currentWord, getNewWord, parsingInfo],
  );

  const formatter = useMemo(
    () => getGeneralFormatter(category) as (parsing: Parsing<WordData>) => string,
    [category],
  );

  return (
    <Box
      padding={2}
      justifyContent="center"
      display="flex"
    >
      <Stack spacing={2} maxWidth={800}>
        <Typography
          variant="h2"
          textAlign="center"
          py={2}
        >
          {currentWord?.word}
        </Typography>

        {ALL_PARTS.map(part => (
          <ToggleButtonGroup
            key={part}
            onChange={handleTogglePart(part)}
            exclusive
            value={parsingInfo[part]}
            disabled={!applicableParts.includes(part)}
          >
            {PART_MAPPING[part].map(value => (
              <ToggleButton
                key={value}
                value={value}
                selected={applicableParts.includes(part) && parsingInfo[part] === value}
              >
                {getPartName(part, value)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        ))}

        <Button
          onClick={handleClickCheck}
          color="primary"
          variant="contained"
          disabled={applicableParts.findIndex(part => parsingInfo[part] === null) >= 0}
        >
          Check
        </Button>

        <ReportDisplay
          report={report}
          formatter={formatter}
        />
      </Stack>
    </Box>
  );
}

export default CustomGamePage;
