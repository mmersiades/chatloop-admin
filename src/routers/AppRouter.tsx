import React from 'react';
import { Switch } from 'react-router-dom';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import AccountSettings from '../pages/AccountSettings';
import InvitesPage from '../pages/InvitesPage';
import { InvitesContextProvider } from '../contexts/invitesContext';
import { UsersContextProvider } from '../contexts/usersContext';
import { LanguagesContextProvider } from '../contexts/languagesContext';
import ReferralsPage from '../pages/ReferralsPage';

export const AppRouter = () => {
  return (
    <Switch>
      <PublicRoute exact path="/" component={LoginPage} />
      <PrivateRoute path="/dashboard" component={DashboardPage} />
      <PrivateRoute path="/account-settings" component={AccountSettings} />
      <PrivateRoute
        path="/users"
        component={() => (
          <UsersContextProvider>
            <LanguagesContextProvider>
              <UsersPage />
            </LanguagesContextProvider>
          </UsersContextProvider>
        )}
      />
      <PrivateRoute
        path="/invites"
        component={() => (
          <InvitesContextProvider>
            <InvitesPage />
          </InvitesContextProvider>
        )}
      />
      <PrivateRoute path="/referrals" component={() => <ReferralsPage />} />
    </Switch>
  );
};

export default AppRouter;
