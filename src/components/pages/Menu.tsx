import {
  Box,
  Button,
  Stack,
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
    <Box padding={2}>
      <Stack spacing={2}>
        <Button
          variant='contained'
          size='large'
          onClick={() => goTo('nouns')}
        >
          Nouns
        </Button>
      </Stack>
    </Box>
  );
}

export default MenuPage;
