import React from "react";
import { Switch } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";

export const AppRouter = () => {
  return (
    <Switch>
      <PublicRoute exact path="/" component={LoginPage} />
      <PrivateRoute path="/dashboard" component={DashboardPage} />
    </Switch>
  );
};

export default AppRouter;
