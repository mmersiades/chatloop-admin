import { UserLanguageObject } from '../@types/interfaces';

const stringifyLanguages = (languages: UserLanguageObject[]) => {
  const languagesArray = languages.map((language) => language.language);
  return languagesArray.join(', ');
};

export default stringifyLanguages;
