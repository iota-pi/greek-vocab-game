import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import { getPage, PageId } from '.';


function MenuPage() {
  const history = useHistory();

  const goTo = useCallback(
    (pageId: PageId) => {
      const page = getPage(pageId);
      history.push(page.path);
    },
    [history],
  );

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

        <Button
          variant='contained'
          size='large'
          onClick={() => goTo('nouns')}
        >
          Noun parsing
        </Button>
      </Stack>
    </Box>
  );
}

export default MenuPage;
