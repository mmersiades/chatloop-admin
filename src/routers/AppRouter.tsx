import React from 'react';
import { Switch } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import AccountSettings from '../pages/AccountSettings';

export const AppRouter = () => {
  return (
    <Switch>
      <PublicRoute exact path="/" component={LoginPage} />
      <PrivateRoute path="/dashboard" component={DashboardPage} />
      <PrivateRoute path="/account-settings" component={AccountSettings} />
      <PrivateRoute path="/users" component={UsersPage} />
    </Switch>
  );
};

export default AppRouter;
