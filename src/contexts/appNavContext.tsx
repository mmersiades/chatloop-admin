import React, { FC, useContext, useState } from 'react';

interface AppNavContext {
  showMenuDrawer: boolean;
  showUserDrawer: number | null;
  showNewUserForm: boolean;
  showReferralDrawer: number | null;
  showNewReferralForm: boolean;
  setShowMenuDrawer: (showMenuDrawer: boolean) => void;
  setShowUserDrawer: (user: number | null) => void;
  setShowNewUserForm: (showNewUserForm: boolean) => void;
  setShowReferralDrawer: (user: number | null) => void;
  setShowNewReferralForm: (showNewReferralForm: boolean) => void;
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
  const [showReferralDrawer, setShowReferralDrawer] = useState<number | null>(
    null
  );
  const [showNewReferralForm, setShowNewReferralForm] = useState(false);

  return (
    <AppNavContext.Provider
      value={{
        showMenuDrawer,
        setShowMenuDrawer,
        showUserDrawer,
        setShowUserDrawer,
        showNewUserForm,
        setShowNewUserForm,
        showReferralDrawer,
        setShowReferralDrawer,
        showNewReferralForm,
        setShowNewReferralForm,
      }}
    >
      {children}
    </AppNavContext.Provider>
  );
};
