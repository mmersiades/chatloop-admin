import React, { FC, useContext, useState } from 'react';

interface AppNavContext {
  showMenuDrawer: boolean;
  showUserDrawer: number | null;
  showNewUserForm: boolean;
  setShowMenuDrawer: (showMenuDrawer: boolean) => void;
  setShowUserDrawer: (user: number | null) => void;
  setShowNewUserForm: (showNewUserForm: boolean) => void;
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
  const [showNewUserForm, setShowNewUserForm] = useState(false);

  return (
    <AppNavContext.Provider
      value={{
        showMenuDrawer,
        setShowMenuDrawer,
        showUserDrawer,
        setShowUserDrawer,
        showNewUserForm,
        setShowNewUserForm,
      }}
    >
      {children}
    </AppNavContext.Provider>
  );
};
