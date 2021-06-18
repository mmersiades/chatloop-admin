import React, { FC, useContext, useState } from 'react';

interface AppNavContext {
  showMenuDrawer: boolean;
  showUserDrawer: number | null;
  setShowMenuDrawer: (showMenuDrawer: boolean) => void;
  setShowUserDrawer: (user: number | null) => void;
}

interface AppNavContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

// eslint-disable-next-line
export const AppNavContext = React.createContext<AppNavContext>(
  {} as AppNavContext
);

export const useAppNav = () => {
  return useContext(AppNavContext);
};

export const AppNavContextProvider: FC<AppNavContextProviderProps> = ({
  children,
}) => {
  const [showMenuDrawer, setShowMenuDrawer] = useState(true);
  const [showUserDrawer, setShowUserDrawer] = useState<number | null>(null);

  return (
    <AppNavContext.Provider
      value={{
        showMenuDrawer,
        setShowMenuDrawer,
        showUserDrawer,
        setShowUserDrawer,
      }}
    >
      {children}
    </AppNavContext.Provider>
  );
};
