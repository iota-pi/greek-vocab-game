import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { getPage, PageId } from '.';
import { useMemo } from 'react';

const PAGE_IDS: PageId[] = ['nouns', 'present-verbs', 'indicative'];

function MenuPage() {
  const history = useHistory();
  const pages = useMemo(() => PAGE_IDS.map(getPage), []);

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

        {pages.map(page => (
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
