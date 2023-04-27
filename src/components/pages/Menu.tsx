import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { gamePages } from '.';


function MenuPage() {
  const history = useHistory();

  return (
    <Box
      padding={2}
      justifyContent="center"
      display="flex"
    >
      <Stack spacing={4} maxWidth={400}>
        <Typography
          variant="h2"
          textAlign="center"
          pt={4}
        >
          Select game
        </Typography>

        {gamePages.map(page => (
          <Button
            key={page.id}
            variant="contained"
            size="large"
            onClick={() => history.push(page.path)}
          >
            {page.name}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

export default MenuPage;
