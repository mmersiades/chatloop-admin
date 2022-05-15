import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { useAuth } from '../contexts/authContext';

interface IPublicRouteProps {
  component: any;
  exact?: boolean;
  path?: string;
}

/**
 * The PublicRoute component is a route wrapper for routes
 * that *don't* require the user to be logged in to see them.
 * If user is logged in, the wrapper redirects paths to the
 * ChatPage component.
 */
export const PublicRoute = ({
  component: Component,
  path,
  ...rest
}: IPublicRouteProps): JSX.Element => {
  const { loggedIn } = useAuth();

  // Where redirect to if logged in
  const to = '/dashboard';

  return (
    <Route
      path={path}
      render={(routeProps: RouteProps) =>
        loggedIn ? (
          <Redirect to={to} />
        ) : (
          <Component {...routeProps} {...rest} />
        )
      }
    />
  );
};

export default PublicRoute;
