/**
 * @module routes
 */

/** */
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

/** Props for PublicRoute component */
interface IPrivateRouteProps {
  /**
   * Has the User logged in?<br>
   * Passed in by **react-redux**
   *  */
  // isLoggedIn: boolean;

  /**
   * The component to be rendered as a child of PrivateRoute<br>
   * Passed in by the parent component (AppRouter)
   *  */
  component: any;

  /**
   * "When true, will only match if the path matches the location.pathname exactly."
   * See [exact](https://reacttraining.com/react-router/web/api/Route/exact-bool).<br>
   * Passed in by the parent component (AppRouter)
   */
  exact?: boolean;

  /**
   * "Any valid URL path or array of paths that path-to-regexp@^1.7.0 understands."
   *  See [path](https://reacttraining.com/react-router/web/api/Route/path-string-string).<br>
   * Passed in by the parent component (AppRouter)
   */
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
