import { Article } from '../types';

type NounData = {
  lexical: string,
  word: string,
  genitive: string,
  article: Article,
  singular?: boolean,
};

const nouns: NounData[] = [
  {
    lexical: 'ἀγγελος, ου, ὁ',
    word: 'ἀγγελος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'θεος, ου, ὁ',
    word: 'θεος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'κοσμος, ου, ὁ',
    word: 'κοσμος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'λογος, ου, ὁ',
    word: 'λογος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'φοβος, ου, ὁ',
    word: 'φοβος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'ἡλιος, ου, ὁ',
    word: 'ἡλιος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'ἀρχη, ης, ἡ',
    word: 'ἀρχη',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'Γαλιλαια, ας, ἡ',
    word: 'Γαλιλαια',
    genitive: 'ας',
    article: 'ἡ',
    singular: true,
  },
  {
    lexical: 'γη, γης, ἡ',
    word: 'γη',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'γλωσσα, ης, ἡ',
    word: 'γλωσσα',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'γραφη, ης, ἡ',
    word: 'γραφη',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'δοξα, ης, ἡ',
    word: 'δοξα',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'θαλασσα, ης, ἡ',
    word: 'θαλασσα',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'παραβολη, ης, ἡ',
    word: 'παραβολη',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'συναγωγη, ης, ἡ',
    word: 'συναγωγη',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'φωνη, ης, ἡ',
    word: 'φωνη',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'ὡρα, ας, ἡ',
    word: 'ὡρα',
    genitive: 'ας',
    article: 'ἡ',
  },
  {
    lexical: 'δαιμονιον, ου, το',
    word: 'δαιμονιον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'ἐργον, ου, το',
    word: 'ἐργον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'εὐαγγελιον, ου, το',
    word: 'εὐαγγελιον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'θηριον, ου, το',
    word: 'θηριον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'ἱερον, ου, το',
    word: 'ἱερον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'ἱματιον, ου, το',
    word: 'ἱματιον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'παιδιον, ου, το',
    word: 'παιδιον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'πλοιον, ου, το',
    word: 'πλοιον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'προσωπον, ου, το',
    word: 'προσωπον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'σαββατον, ου, το',
    word: 'σαββατον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'τεκνον, ου, το',
    word: 'τεκνον',
    genitive: 'ου',
    article: 'το',
  },
  {
    lexical: 'Ἀνδρεας, ου, ὁ',
    word: 'Ἀνδρεας',
    genitive: 'ου',
    article: 'ὁ',
    singular: true,
  },
  {
    lexical: 'ἐρημος, ου, ἡ',
    word: 'ἐρημος',
    genitive: 'ου',
    article: 'ἡ',
  },
  {
    lexical: 'ἐρημος, ου, ἡ',
    word: 'ἐρημος',
    genitive: 'ου',
    article: 'ἡ',
  },
  {
    lexical: 'Ἡσα̈ιας, ου, ὁ',
    word: 'Ἡσα̈ιας',
    genitive: 'ου',
    article: 'ὁ',
    singular: true,
  },
  {
    lexical: 'θανατος, ου, ὁ',
    word: 'θανατος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'μαθητης, ου, ὁ',
    word: 'μαθητης',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'μαθητης, ου, ὁ',
    word: 'μαθητης',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'ὁδος, ου, ἡ',
    word: 'ὁδος',
    genitive: 'ου',
    article: 'ἡ',
  },
  {
    lexical: 'ὁδος, ου, ἡ',
    word: 'ὁδος',
    genitive: 'ου',
    article: 'ἡ',
  },
  {
    lexical: 'προφητης, ου, ὁ',
    word: 'προφητης',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'προφητης, ου, ὁ',
    word: 'προφητης',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'ἁμαρτια, ας, ἡ',
    word: 'ἁμαρτια',
    genitive: 'ας',
    article: 'ἡ',
  },
  {
    lexical: 'βασιλεια, ας, ἡ',
    word: 'βασιλεια',
    genitive: 'ας',
    article: 'ἡ',
  },
  {
    lexical: 'διδαχη, ης, ἡ',
    word: 'διδαχη',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'ἐξουσια, ας, ἡ',
    word: 'ἐξουσια',
    genitive: 'ας',
    article: 'ἡ',
  },
  {
    lexical: 'ἡμερα, ας, ἡ',
    word: 'ἡμερα',
    genitive: 'ας',
    article: 'ἡ',
  },
  {
    lexical: 'θυρα, ας, ἡ',
    word: 'θυρα',
    genitive: 'ας',
    article: 'ἡ',
  },
  {
    lexical: 'καιρος, ου, ὁ',
    word: 'καιρος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'μετανοια, ας, ἡ',
    word: 'μετανοια',
    genitive: 'ας',
    article: 'ἡ',
  },
  {
    lexical: 'οἰκος, ου, ὁ',
    word: 'οἰκος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'οἰκια, ας, ἡ',
    word: 'οἰκια',
    genitive: 'ας',
    article: 'ἡ',
  },
  {
    lexical: 'υἱος, ου, ὁ',
    word: 'υἱος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'ζωη, ης, ἡ',
    word: 'ζωη',
    genitive: 'ης',
    article: 'ἡ',
  },
  {
    lexical: 'καρδια, ας, ἡ',
    word: 'καρδια',
    genitive: 'ας',
    article: 'ἡ',
  },
  {
    lexical: 'λαος, ου, ὁ',
    word: 'λαος',
    genitive: 'ου',
    article: 'ὁ',
  },
  {
    lexical: 'μαρτυρια, ας, ἡ',
    word: 'μαρτυρια',
    genitive: 'ας',
    article: 'ἡ',
  },
  {
    lexical: 'ἀγαπη, ης, ἡ',
    word: 'ἀγαπη',
    genitive: 'ης',
    article: 'ἡ',
  },
];

export default nouns;