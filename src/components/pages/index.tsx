import { ReactNode, useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import GameCustomisation from './GameCustomisation';
import CustomGamePage from './CustomGamePage';

export type PageId = (
  | 'menu'
  | 'practice'
);

export interface Page {
  id: PageId,
  name: string,
  path: string,
  page: ReactNode,
}

export const pages: Page[] = [
  {
    id: 'practice',
    path: '/practice',
    name: 'Practice Parsing',
    page: <CustomGamePage />,
  },
  {
    id: 'menu',
    path: '/',
    name: 'Menu',
    page: <GameCustomisation />,
  },
];

function PageView() {
  const pageRoutes = useMemo(
    () => pages.map(page => (
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
  const result = pages.find(p => p.id === page);
  if (result === undefined) {
    throw new Error(`Unknown page id ${page}`);
  }
  return result;
}
