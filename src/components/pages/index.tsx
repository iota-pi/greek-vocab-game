import { ReactNode, useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import MenuPage from './Menu';
import NounsPage from './Nouns';
import PresentVerbsPage from './PresentVerbs';
import PIAFVerbs from './PIAFVerbs';

export type PageId = (
  | 'menu'
  | 'nouns'
  | 'present-verbs'
  | 'piaf-verbs'
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
  {
    id: 'present-verbs',
    path: '/present-verbs/',
    name: 'Present Verbs',
    page: <PresentVerbsPage />,
  },
  {
    id: 'piaf-verbs',
    path: '/piaf-verbs/',
    name: 'Pres/Imp/Aor Verbs',
    page: <PIAFVerbs />,
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
