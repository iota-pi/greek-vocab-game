import { ReactNode, useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import MenuPage from './Menu';
import GamePage from './GamePage';
import { GameData, games } from '../games';
import { Noun, Verb } from '../../types';
import GameCustomisation from './GameCustomisation';
import CustomGamePage from './CustomGamePage';

export type PageId = (
  | 'menu'
  | 'customise'
  | 'practice'
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
  {
    id: 'customise',
    path: '/customise',
    name: 'Customise Study',
    page: <GameCustomisation />,
  },
  {
    id: 'practice',
    path: '/practice',
    name: 'Practice Parsing',
    page: <CustomGamePage />,
  }
];

export const gamePages: Page[] = [
  {
    id: 'nouns',
    path: '/nouns/',
    name: 'Nouns',
    page: <GamePage game={games.firstAndSecondNouns as GameData<Noun.Data>} />,
  },
  {
    id: 'present-verbs',
    path: '/present-verbs/',
    name: 'Present Active Indicative Verbs',
    page: <GamePage game={games.verbs as GameData<Verb.Data>} />,
  },
  {
    id: 'indicative',
    path: '/indicative/',
    name: 'Indicative Verbs',
    page: <GamePage game={games.indicative as GameData<Verb.Data>} />,
  },
  {
    id: 'imperative',
    path: '/imperative/',
    name: 'Imperative Verbs',
    page: <GamePage game={games.imperative as GameData<Verb.Data>} />,
  },
  {
    id: 'infinitive',
    path: '/infinitive/',
    name: 'Infinitive Verbs',
    page: <GamePage game={games.infinitive as GameData<Verb.Data>} />,
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
