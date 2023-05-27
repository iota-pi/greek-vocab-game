import { ReactNode, useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import MenuPage from './Menu';
import NounsPage from './NounsPage';
import PresentVerbsPage from './PresentVerbsPage';
import IndicativeVerbs from './IndicativeVerbsPage';
import InfinitiveVerbs from './InfinitiveVerbsPage';
import ImperativeVerbs from './ImperativeVerbsPage';

export type PageId = (
  | 'menu'
  | 'nouns'
  | 'present-verbs'
  | 'indicative'
  | 'imperative'
  | 'infinitive'
);

export interface Page {
  id: PageId,
  name: string,
  path: string,
  page: ReactNode,
}

export const functionalPages: Page[] = [
  {
    id: 'menu',
    path: '/',
    name: 'Menu',
    page: <MenuPage />,
  },
];

export const gamePages: Page[] = [
  {
    id: 'nouns',
    path: '/nouns/',
    name: 'Nouns',
    page: <NounsPage />,
  },
  {
    id: 'present-verbs',
    path: '/present-verbs/',
    name: 'Present Active Indicative Verbs',
    page: <PresentVerbsPage />,
  },
  {
    id: 'indicative',
    path: '/indicative/',
    name: 'Indicative Verbs',
    page: <IndicativeVerbs />,
  },
  {
    id: 'imperative',
    path: '/imperative/',
    name: 'Imperative Verbs',
    page: <ImperativeVerbs />,
  },
  {
    id: 'infinitive',
    path: '/infinitive/',
    name: 'Infinitive Verbs',
    page: <InfinitiveVerbs />,
  },
];

const allPages = [...functionalPages, ...gamePages].reverse();

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
