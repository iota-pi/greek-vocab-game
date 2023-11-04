import { Noun, Verb } from '../types';
import { StudyCategory, getCaseName, getGenderName, getMoodName, getNumberName, getPersonName, getTenseName, getVoiceName } from '../util';

export function getGeneralFormatter(category: StudyCategory) {
  if (category === 'noun') {
    return (parsing: Noun.Parsing) => (
      [
        getCaseName(parsing.nounCase),
        getNumberName(parsing.number),
        getGenderName(parsing.gender),
      ].join(' ')
    );
  } else {
    return (parsing: Verb.Parsing) => (
      [
        getTenseName(parsing.tense),
        getVoiceName(parsing.voice),
        getMoodName(parsing.mood),
        (
          !['participle', 'infinitive'].includes(parsing.mood)
            ? getPersonName(parsing.person)
            : ''
        ),
        parsing.mood !== 'infinitive' ? getNumberName(parsing.number) : '',
        parsing.mood === 'participle' ? getCaseName(parsing.nounCase) : '',
      ].join(' ').trim()
    );
  }
}
