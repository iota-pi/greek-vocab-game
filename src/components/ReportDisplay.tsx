import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CrossIcon from '@mui/icons-material/Close';
import { BaseData, Parsing, Report } from '../types';


function ReportDisplay<T extends BaseData>(
  {
    formatter,
    report,
  }: {
    formatter: (form: Parsing<T>) => string,
    report: Report<T>[],
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
