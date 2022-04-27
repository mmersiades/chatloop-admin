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
import ReferralsPage from '../pages/ReferralsPage';
import { ReferralsProvider } from '../contexts/referralsContext';
import { StatsProvider } from '../contexts/statsContext';

export const AppRouter = () => {
  return (
    <Switch>
      <PublicRoute exact path="/" component={LoginPage} />
      <PrivateRoute
        path="/dashboard"
        component={() => (
          <StatsProvider>
            <DashboardPage />
          </StatsProvider>
        )}
      />
      <PrivateRoute path="/account-settings" component={AccountSettings} />
      <PrivateRoute
        path="/users"
        component={() => (
          <UsersContextProvider>
            <UsersPage />
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
      <PrivateRoute
        path="/referrals"
        component={() => (
          <ReferralsProvider>
            <ReferralsPage />
          </ReferralsProvider>
        )}
      />
    </Switch>
  );
};

export default AppRouter;
