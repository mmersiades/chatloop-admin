import React from "react";
import { Switch } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import LoginPage from "../pages/LoginPage";

export const AppRouter = () => {
  return (
    <Switch>
      <PublicRoute path="/" component={LoginPage} />
    </Switch>
  );
};

export default AppRouter;
