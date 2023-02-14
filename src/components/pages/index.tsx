import { ReactNode, useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { DataIcon, MuiIconType } from '../Icons';
import DataPage from './Menu';

export type PageId = (
  'data' |
  'groups' |
  'finish'
);

export interface Page {
  id: PageId,
  name: string,
  icon: MuiIconType,
  path: string,
  page: ReactNode,
}

export const pages: Page[] = [
  {
    id: 'data',
    path: '/',
    name: 'Data',
    icon: DataIcon,
    page: <DataPage />,
  },
];

const allPages = pages.slice().reverse();

function PageView() {
  const pageRoutes = useMemo(
    () => allPages.map(page => (
      <Route
        key={page.id}
        path={page.path}
      >
        {page.page}
      </Route>
    )),
    [],
  );

  return (
    <Switch>
      {pageRoutes}
    </Switch>
  );
}

export default PageView;

export function getPage(page: PageId) {
  const result = allPages.find(p => p.id === page);
  if (result === undefined) {
    throw new Error(`Unknown page id ${page}`);
  }
  return result;
}
