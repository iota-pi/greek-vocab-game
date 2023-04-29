import { AdjectiveForm } from '../types';
import { applyWeightings } from '../util';

type AdjectiveData = {
  lexical: string,
  word: string,
  form: AdjectiveForm,
  weight?: number,
};

const rawAdjectives: AdjectiveData[] = [
  {
    lexical: 'ἀγαθος, η, ον',
    word: 'ἀγαθος',
    form: '2-2-2',
  },
  {
    lexical: 'ἁγιος, α, ον',
    word: 'ἁγιος',
    form: '2-2-2',
  },
  {
    lexical: 'δικαιος, α, ον',
    word: 'δικαιος',
    form: '2-2-2',
  },
  {
    lexical: 'ἐμος, η, ον',
    word: 'ἐμος',
    form: '2-2-2',
  },
  {
    lexical: 'Ἰουδαιος, α, ον',
    word: 'Ἰουδαιος',
    form: '2-2-2',
  },
  {
    lexical: 'ἀλλος, η, ο',
    word: 'ἀλλος',
    form: '2-2-2',
  },
  {
    lexical: 'ἁμαρτωλος, ον',
    word: 'ἁμαρτωλος',
    form: '2-2',
  },
  {
    lexical: 'ὁλος, η, ον',
    word: 'ὁλος',
    form: '2-2-2',
  },
];

const adjectives = applyWeightings(rawAdjectives);

export default adjectives;
