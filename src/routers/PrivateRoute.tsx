import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface IPrivateRouteProps {
  component: any;
  exact?: boolean;
  path: string;
  setShowProfileDrawer?: (open: boolean) => void;
}

/**
 * The PrivateRoute component is a route wrapper for routes
 * that require the user to be logged in to see them.
 * If user is *not* logged in, the wrapper redirects paths to the
 * LandingPage component.
 */
export const PrivateRoute = ({
  component: Component,
  path,
  ...rest
}: IPrivateRouteProps): JSX.Element => {
  // Determines login status by looking for JWT in localStorage
  const token: string | null = localStorage.getItem('loginToken');

  return (
    <Route
      path={path}
      render={(routeProps: RouteProps) =>
        token ? <Component {...routeProps} {...rest} /> : <Redirect to="/" />
      }
    />
  );
};

export default PrivateRoute;
