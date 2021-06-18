import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ExpiryInterval } from '../@types/interfaces';
import baseURL from '../serverUrls';

interface AppPropertiesContext {
  inviteExpiryInterval?: ExpiryInterval;
}

interface AppPropertiesProviderProps {
  children: JSX.Element | JSX.Element[];
}

// eslint-disable-next-line
const AppPropertiesContext = createContext<AppPropertiesContext>({});

export const useAppProperties = () => useContext(AppPropertiesContext);

export const AppPropertiesConsumer = AppPropertiesContext.Consumer;

export const AppPropertiesProvider: FC<AppPropertiesProviderProps> = ({
  children,
}) => {
  const [inviteExpiryInterval, setInviteExpiryInterval] =
    useState<ExpiryInterval | undefined>();

  // These expiry intervals will be hardcoded for now,
  // until we have endpoints for fetching them from the back-end
  const setApplicationProperties = () => {
    if (baseURL === 'https://api.chatloop.org') {
      // For production environment
      setInviteExpiryInterval({
        value: 3,
        unit: 'hours',
        ms: 10800000,
      });
    } else {
      // For local and staging environments
      setInviteExpiryInterval({
        value: 20,
        unit: 'seconds',
        ms: 20000,
      });
    }
  };

  useEffect(() => {
    setApplicationProperties();
  }, []);

  return (
    <AppPropertiesContext.Provider value={{ inviteExpiryInterval }}>
      {children}
    </AppPropertiesContext.Provider>
  );
};
