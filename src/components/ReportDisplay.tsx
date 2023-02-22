import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CrossIcon from '@mui/icons-material/Close';
import { Report } from '../types';


function ReportDisplay<P>(
  {
    formatter,
    report,
  }: {
    formatter: (form: P) => string,
    report: Report<P>[],
  },
) {
  return (
    <List dense>
      {report.map(({ correct, given, expected, word }, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <ListItem key={`reportItem-${i}`}>
          <ListItemIcon>
            {(
              correct
                ? <CheckIcon color="success" />
                : <CrossIcon color="error" />
            )}
          </ListItemIcon>

          <ListItemText
            primary={(
              `${word} — ${formatter(given)}`
            )}
            secondary={correct ? '' : (
              `Expected: ${formatter(expected)}`
            )}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default ReportDisplay;
