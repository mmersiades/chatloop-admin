import React from "react";
import {
  Switch,
  withRouter,
  RouteComponentProps,
  Redirect,
  Route
} from "react-router-dom";
import LoginPage from "../pages/LoginPage";

export const AppRouter = () => {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
    </Switch>
  );
};

export default AppRouter;
