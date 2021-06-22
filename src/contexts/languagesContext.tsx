import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Language } from '../@types/interfaces';
import { getLanguages } from '../services/languagesService';

interface LanguagesContext {
  languages: Language[];
}

interface LanguagesContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

const initialContext: LanguagesContext = { languages: [] };

// eslint-disable-next-line
export const LanguagesContext = createContext<LanguagesContext>(initialContext);

export const useLanguages = () => {
  return useContext(LanguagesContext);
};

export const LanguagesContextProvider: FC<LanguagesContextProviderProps> = ({
  children,
}) => {
  const [languages, setLanguages] = useState<Language[]>([]);

  const fetchLanguages = async () => {
    try {
      const response = await getLanguages();
      setLanguages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <LanguagesContext.Provider value={{ languages }}>
      {children}
    </LanguagesContext.Provider>
  );
};
