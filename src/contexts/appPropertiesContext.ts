import React, { useContext } from 'react';
import { ExpiryInterval } from '../@types/interfaces';

interface AppPropertiesContext {
  inviteExpiryInterval?: ExpiryInterval;
}

export const AppPropertiesContext = React.createContext<AppPropertiesContext>({} as AppPropertiesContext);

export const useAppProperties = () => {
  return useContext(AppPropertiesContext);
};
