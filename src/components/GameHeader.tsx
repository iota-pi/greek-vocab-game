import { Box, Button, Divider } from '@mui/material';
import Timer from './Timer';

function GameHeader({
  endTime,
  questionsInQuiz,
  onRestart,
  score,
  startTime,
  total,
}: {
  endTime: Date | null,
  questionsInQuiz: number | null,
  onRestart: () => void,
  score: number,
  startTime: Date | null,
  total: number,
}) {
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        width="100%"
      >
        <Box flex={1}>
          Score: {score} / {total}
          {questionsInQuiz !== null && (
            ` (${questionsInQuiz - total} remaining)`
          )}
        </Box>

        <Box
          display="flex"
          flex={1}
          justifyContent="center"
        >
          {startTime && (
            <span>
              Time: <Timer startTime={startTime} endTime={endTime} />
            </span>
          )}
        </Box>

        <Box
          display="flex"
          flex={1}
          justifyContent="flex-end"
        >
          <Button
            onClick={onRestart}
            variant="outlined"
          >
            Restart
          </Button>
        </Box>
      </Box>

      <Box pt={2} pb={1}>
        <Divider />
      </Box>
    </>
  );
}

export default GameHeader;
