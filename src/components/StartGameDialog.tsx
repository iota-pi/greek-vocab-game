import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import BackIcon from '@mui/icons-material/ChevronLeft';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import type {
  Report,
} from '../types';
import HighScores from './HighScores';
import { getPage, PageId } from './pages';
import ReportDisplay from './ReportDisplay';
import Timer from './Timer';

const DEFAULT_TIME = 1000 * 60 * 60;

function StartGameDialog<T>({
  endTime,
  formatter,
  onStart,
  report,
  score,
  startTime,
  title,
  total,
}: {
  endTime: Date | null,
  formatter: (form: T) => string,
  onStart: () => void,
  report: Report<T>[],
  score: number,
  startTime: Date | null,
  title: string,
  total: number,
}) {
  const history = useHistory();

  const goTo = useCallback(
    (pageId: PageId) => {
      const page = getPage(pageId);
      history.push(page.path);
    },
    [history],
  );

  return (
    <Dialog
      open
    >
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="h3">
            {title}
          </Typography>
          <Button
            onClick={onStart}
            variant="contained"
          >
            Start
          </Button>

          <Divider />

          {report.length > 0 && (
            <div>
              <Typography
                component="div"
                color={score === total ? 'success.main' : 'warning.main'}
                fontWeight={400}
                textAlign="center"
                variant="h5"
              >
                {score} / {total}
              </Typography>

              <Typography
                textAlign="center"
                variant="h5"
              >
                {startTime && (
                  <Timer startTime={startTime} endTime={endTime} />
                )}
              </Typography>
            </div>
          )}

          <HighScores
            category="nouns"
            canSubmit={report.length > 0}
            score={score}
            time={(
              startTime && endTime
                ? endTime.getTime() - startTime.getTime()
                : DEFAULT_TIME
            )}
            total={total}
          />

          <Divider />

          {report.length > 0 && (
            <>
              <ReportDisplay
                report={report}
                formatter={formatter}
              />

              <Button
                variant="outlined"
                onClick={onStart}
              >
                Play again
              </Button>
            </>
          )}

          <Button
            size="large"
            onClick={() => goTo('menu')}
            startIcon={<BackIcon />}
          >
            Change game
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default StartGameDialog;
