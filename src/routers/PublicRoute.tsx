/**
 * @module routes
 */

/** */
import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

/** Props for PublicRoute component */
interface IPublicRouteProps {
  /**
   * Has the User logged in?<br>
   * Passed in by **react-redux**
   *  */
  // isLoggedIn: boolean;

  /**
   * The component to be rendered as a child of PublicRoute<br>
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
   * See [path](https://reacttraining.com/react-router/web/api/Route/path-string-string).<br>
   * Passed in by the parent component (AppRouter)
   */
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
  // Determines login status by looking for JWT in localStorage
  const token: string | null = localStorage.getItem("token");

  // Where redirect to if logged in
  const to = "/dashboard";

  return (
    <Route
      path={path}
      render={(routeProps: RouteProps) =>
        token ? <Redirect to={to} /> : <Component {...routeProps} {...rest} />
      }
    />
  );
};

/** @ignore */
// const mapStateToProps = ({ authentication }: IStore) => {
//   return { isLoggedIn: authentication.isLoggedIn };
// };

export default PublicRoute;
