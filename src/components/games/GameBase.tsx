import {
  Box,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { FC, useCallback, useState } from 'react';
import type {
  GameComponentProps,
  Report,
  WordWithParsing,
} from '../../types';
import StartGameDialog from '../StartGameDialog';
import GameHeader from '../GameHeader';

function GameBase<T>({
  gameComponent: GameComponent,
  formatter,
  numQuestions,
  pickWord,
}: {
  gameComponent: FC<GameComponentProps<T>>,
  formatter: (form: T) => string,
  numQuestions: number,
  pickWord: () => WordWithParsing<T>,
}) {
  const [currentWord, setCurrentWord] = useState(pickWord());
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [report, setReport] = useState<Report<T>[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const getNewWord = useCallback(
    () => setCurrentWord(
      prev => {
        let word = pickWord();
        for (let i = 0; i < 3 && word === prev; ++i) {
          word = pickWord();
        }
        return word;
      },
    ),
    [],
  );

  const handleAnswer = useCallback(
    (correct: boolean, chosen: T) => {
      setTotal(t => t + 1);
      if (correct) {
        setScore(s => s + 1);
      }

      const newReport: Report<T> = {
        word: currentWord.word,
        correct,
        expected: { ...currentWord },
        given: chosen,
      };
      setReport(r => [...r, newReport]);

      if (total + 1 >= numQuestions) {
        setEndTime(new Date());
      }

      getNewWord();
    },
    [currentWord, getNewWord, total],
  );

  const handleStart = useCallback(
    () => {
      setReport([]);
      setScore(0);
      setTotal(0);
      setStartTime(new Date());
      setEndTime(null);
      getNewWord();
    },
    [getNewWord],
  );

  const handleRestart = useCallback(
    () => setEndTime(new Date()),
    [],
  );

  const gameActive = !!startTime && !endTime;

  return (
    <Box padding={2}>
      <GameHeader
        endTime={endTime}
        questionsInQuiz={numQuestions}
        onRestart={handleRestart}
        score={score}
        startTime={startTime}
        total={total}
      />

      <Stack alignItems="center">
        {gameActive ? (
          <>
            <Typography
              variant="h2"
              textAlign="center"
              py={2}
            >
              {currentWord.word}
            </Typography>

            <GameComponent
              currentWord={currentWord}
              onAnswer={handleAnswer}
            />
          </>
        ) : (
          <StartGameDialog
            category="nouns"
            title="Greek Noun Parsing"
            onStart={handleStart}
            report={report}
            endTime={endTime}
            startTime={startTime}
            formatter={formatter}
            score={score}
            total={total}
          />
        )}

        <Divider />
      </Stack>
    </Box>
  );
}

export default GameBase;
