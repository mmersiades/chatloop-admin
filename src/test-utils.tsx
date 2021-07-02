import React, { FC, ReactElement } from 'react';
import { Router } from 'react-router-dom';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { theme } from './components/Root';
import history from './helpers/getBrowserHistory';
import { AppPropertiesProvider } from './contexts/appPropertiesContext';
import { AppNavContextProvider } from './contexts/appNavContext';
import { LanguagesContextProvider } from './contexts/languagesContext';
import { UsersContextProvider } from './contexts/usersContext';
import { InvitesContextProvider } from './contexts/invitesContext';

interface NoAuthProvidersProps {
  children: JSX.Element;
}

const NoAuthProviders: FC<NoAuthProvidersProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <AppPropertiesProvider>
            <AppNavContextProvider>{children}</AppNavContextProvider>
          </AppPropertiesProvider>
        </ThemeProvider>
      </Router>
    </>
  );
};

interface UserPageProvidersProps {
  children: JSX.Element;
}

const UserPageProviders: FC<UserPageProvidersProps> = ({ children }) => {
  return (
    <NoAuthProviders>
      <UsersContextProvider>
        <LanguagesContextProvider>{children}</LanguagesContextProvider>
      </UsersContextProvider>
    </NoAuthProviders>
  );
};

export const userPageRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) =>
  render(ui, {
    wrapper: (props: any) => <UserPageProviders {...props} {...options} />,
  });

interface InvitesPageProvidersProps {
  children: JSX.Element;
}

const InvitesPageProviders: FC<InvitesPageProvidersProps> = ({ children }) => {
  return (
    <NoAuthProviders>
      <InvitesContextProvider>{children}</InvitesContextProvider>
    </NoAuthProviders>
  );
};

export const invitesPageRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) =>
  render(ui, {
    wrapper: (props: any) => <InvitesPageProviders {...props} {...options} />,
  });

interface AllTheProvidersProps {
  children: JSX.Element;
}

const AllTheProviders: FC<AllTheProvidersProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <AppPropertiesProvider>
            <AppNavContextProvider>
              <UsersContextProvider>
                <InvitesContextProvider>
                  <LanguagesContextProvider>
                    {children}
                  </LanguagesContextProvider>
                </InvitesContextProvider>
              </UsersContextProvider>
            </AppNavContextProvider>
          </AppPropertiesProvider>
        </ThemeProvider>
      </Router>
    </>
  );
};

export const renderWithAllProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) =>
  render(ui, {
    wrapper: (props: any) => <AllTheProviders {...props} {...options} />,
  });
