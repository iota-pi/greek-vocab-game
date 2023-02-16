import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { HighScore } from '../lambda/api/types';
import { GameCategory } from './types';
import { API_ENDPOINT, formatTime, splitTime } from './util';

function HighScores(
  {
    category,
    canSubmit,
  }: {
    category: GameCategory,
    canSubmit?: boolean,
  },
) {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const usernameRef = useRef();

  useEffect(
    () => {
      fetch(
        `${API_ENDPOINT}/scores/${category}`,
        { mode: 'no-cors' },
      ).then(result => {
        console.log(result);
        // setHighScores();
      });
    },
    [],
  );

  return (
    <>
      <List dense>
        {highScores.map(({ name, score, total, time }, i) => (
          <ListItem key={`highScore-${name}`}>
            <ListItemText
              primary={name}
              secondary={(
                `${score} / ${total} — ${formatTime(splitTime(time))}`
              )}
            />
          </ListItem>
        ))}
      </List>

      {canSubmit && (
        <>
          <TextField
            inputRef={usernameRef}
            label="Name"
          />

          <Button>
            Submit Score
          </Button>
        </>
      )}
    </>
  );
}

export default HighScores;
