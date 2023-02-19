import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HighScore } from '../lambda/api/types';
import { setUsername } from './state/ui';
import { useAppSelector } from './store';
import { GameCategory } from './types';
import { API_ENDPOINT, formatTime, splitTime } from './util';

function HighScores(
  {
    category,
    canSubmit,
    score,
    time,
    total,
  }: {
    category: GameCategory,
    canSubmit?: boolean,
    score: number,
    time: number,
    total: number,
  },
) {
  const dispatch = useDispatch();
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const savedUsername = useAppSelector(state => state.ui.username);
  const [username, setLocalUsername] = useState(savedUsername);

  const handleChangeUsername = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLocalUsername(event.target.value);
    },
    [],
  );
  const usernameError = (
    (!username || /^[a-zA-Z0-9_]+$/.test(username))
      ? ''
      : 'Please only user letters, numbers, or underscores'
  );

  useEffect(
    () => {
      axios.get(
        `${API_ENDPOINT}/scores/${category}`,
      ).then(result => {
        if (Array.isArray(result.data.scores)) {
          setHighScores(result.data.scores);
        }
      });
    },
    [category],
  );

  const handleSubmit = useCallback(
    () => {
      dispatch(setUsername(username));

      axios.put(
        `${API_ENDPOINT}/scores/${category}/${username}`,
        { score, total, time },
      ).then(result => {
        if (Array.isArray(result.data.scores)) {
          setHighScores(result.data.scores);
        }
      });
    },
    [category, dispatch, score, total, time, username],
  );

  return (
    <>
      {canSubmit && (
        <>
          <TextField
            value={username}
            onChange={handleChangeUsername}
            error={!!usernameError}
            helperText={usernameError}
            label="Name"
          />

          <Button
            disabled={!!usernameError || !username}
            onClick={handleSubmit}
            variant="outlined"
          >
            Submit Score
          </Button>
        </>
      )}

      <Typography variant="h5" fontWeight={400} pt={2}>
        High scores
      </Typography>

      <List disablePadding>
        {highScores.map(({ name, score, total, time }, i) => (
          <ListItem key={`highScore-${name}`} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Typography variant="h5" color="text.primary">
                {i + 1}.
              </Typography>
            </ListItemIcon>

            <ListItemText
              primary={name}
              secondary={(
                `${score} / ${total} — ${formatTime(splitTime(time))}`
              )}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default HighScores;
