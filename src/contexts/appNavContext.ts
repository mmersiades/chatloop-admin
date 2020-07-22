import React, { useContext } from 'react';

interface AppNavContext {
  showMenuDrawer: boolean;
  showUserDrawer: number | null;
  setShowMenuDrawer: (showMenuDrawer: boolean) => void;
  setShowUserDrawer: (user: number | null) => void;
}

export const AppNavContext = React.createContext<AppNavContext>({} as AppNavContext);

export const useAppNav = () => {
  return useContext(AppNavContext);
};
