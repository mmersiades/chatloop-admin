import React, { useContext } from 'react';

interface AppNavContext {
  showMenuDrawer: boolean;
  showUserDrawer: boolean;
  setShowMenuDrawer: (showMenuDrawer: boolean) => void;
  setShowUserDrawer: (showUserDrawer: boolean) => void;
}

export const AppNavContext = React.createContext<AppNavContext>({} as AppNavContext);

export const useAppNav = () => {
  return useContext(AppNavContext);
};
