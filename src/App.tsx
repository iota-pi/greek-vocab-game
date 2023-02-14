import { BrowserRouter as Router } from 'react-router-dom';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import PageView from './components/pages';

const Root = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});


export default function App() {
  return (
    <Router>
      <Root>
        <PageView />
      </Root>
    </Router>
  );
}
