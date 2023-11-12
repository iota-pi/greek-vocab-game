import { Noun, Parsing, Report, Verb, WordData, WordWithParsing } from '../../types';
import { useLocalStorage } from 'usehooks-ts';
import {
  ALL_CASES,
  ALL_GENDERS,
  ALL_MOODS,
  ALL_NUMBERS,
  ALL_PARTS,
  ALL_PERSONS,
  ALL_TENSES,
  ALL_VOICES,
  CombinedParsing,
  PART_MAPPING,
  ParsingPart,
  StudyCategory,
  checkParsing,
  getPartName,
  getPickNoun,
  getPickVerb,
  getRelevantVerbParts,
  isNoun,
  isValidParsing,
  isVerb,
} from '../../util';
import { getGeneralFormatter } from '../formatter';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import nouns from '../../data/nouns';
import verbs from '../../data/verbs';
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import ReportDisplay from '../ReportDisplay';

export type CombinedParsingWithNulls = {
  [k in ParsingPart]: CombinedParsing[k] | null;
}
const BLANK_PARSING: CombinedParsingWithNulls = {
  gender: null,
  mood: null,
  nounCase: null,
  number: null,
  person: null,
  tense: null,
  voice: null,
};

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
      if (isNoun(currentWord)) {
        return ['gender', 'nounCase', 'number'];
      }
      // TODO: disable first person for imperatives
      return getRelevantVerbParts(parsingInfo);
    },
    [currentWord.data, parsingInfo],
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
      let otherPossibleParsings = possibleParsings;
      let correct = false;
      for (const parsing of possibleParsings) {
        correct = applicableParts.every(
          part => parsingInfo[part] === parsing[part]
        );
        if (correct) {
          otherPossibleParsings = otherPossibleParsings.filter(p => p !== parsing);
          break;
        }
      }
      const newReport: Report<WordData> = {
        word: currentWord.word,
        correct,
        expected: otherPossibleParsings,
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
