import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ExpiryInterval } from '../@types/interfaces';
import {
  DEV_EXPIRY_INTERVAL,
  DEV_PARTNER_QUEUE_SIZE,
  PROD_EXPIRY_INTERVAL,
  PROD_PARTNER_QUEUE_SIZE,
} from '../config/constants';
import baseURL from '../serverUrls';

interface AppPropertiesContext {
  inviteExpiryInterval?: ExpiryInterval;
  partnerQueueDefaultSize?: number;
}

interface AppPropertiesProviderProps {
  children: JSX.Element | JSX.Element[];
}

const initialState: AppPropertiesContext = {
  inviteExpiryInterval: undefined,
  partnerQueueDefaultSize: undefined,
};

const appPropertiesContext = createContext<AppPropertiesContext>(initialState);

export const useAppProperties = () => useContext(appPropertiesContext);

export const AppPropertiesConsumer = appPropertiesContext.Consumer;

export const AppPropertiesProvider: FC<AppPropertiesProviderProps> = ({
  children,
}) => {
  const [inviteExpiryInterval, setInviteExpiryInterval] = useState<
    ExpiryInterval | undefined
  >(initialState.inviteExpiryInterval);
  const [partnerQueueDefaultSize, setPartnerQueueDefaultSize] = useState<
    number | undefined
  >(initialState.partnerQueueDefaultSize);

  // These expiry intervals will be hardcoded for now,
  // until we have endpoints for fetching them from the back-end
  const setApplicationProperties = () => {
    if (baseURL === 'https://api.chatloop.org') {
      // For production environment
      setInviteExpiryInterval(PROD_EXPIRY_INTERVAL);
      setPartnerQueueDefaultSize(PROD_PARTNER_QUEUE_SIZE);
    } else {
      // For local and staging environments
      setInviteExpiryInterval(DEV_EXPIRY_INTERVAL);
      setPartnerQueueDefaultSize(DEV_PARTNER_QUEUE_SIZE);
    }
  };

  useEffect(() => {
    setApplicationProperties();
  }, []);

  return (
    <appPropertiesContext.Provider
      value={{ inviteExpiryInterval, partnerQueueDefaultSize }}
    >
      {children}
    </appPropertiesContext.Provider>
  );
};
