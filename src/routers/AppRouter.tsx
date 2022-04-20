import React from 'react';
import { Switch } from 'react-router-dom';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import AccountSettings from '../pages/AccountSettings';
import InvitesPage from '../pages/InvitesPage';
import OrganisationsPage from '../pages/OrganisationsPage';
import ReferralsPage from '../pages/ReferralsPage';
import { InvitesContextProvider } from '../contexts/invitesContext';
import { UsersContextProvider } from '../contexts/usersContext';
import { ReferralsProvider } from '../contexts/referralsContext';
import { OrganisationsProvider } from '../contexts/organisationsContext';

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
      <PrivateRoute
        path="/orgs"
        component={() => (
          <OrganisationsProvider>
            <OrganisationsPage />
          </OrganisationsProvider>
        )}
      />
    </Switch>
  );
};

export default AppRouter;
