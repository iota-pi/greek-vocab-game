import { ReactNode, useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import MenuPage from './Menu';
import NounsPage from './Nouns';

export type PageId = (
  | 'menu'
  | 'nouns'
);

export interface Page {
  id: PageId,
  name: string,
  path: string,
  page: ReactNode,
}

export const pages: Page[] = [
  {
    id: 'menu',
    path: '/',
    name: 'Menu',
    page: <MenuPage />,
  },
  {
    id: 'nouns',
    path: '/nouns/',
    name: 'Nouns',
    page: <NounsPage />,
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
