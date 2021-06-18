import React, { FC } from 'react';
import { Router } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { AppPropertiesProvider } from '../contexts/appPropertiesContext';
import { UsersContextProvider } from '../contexts/usersContext';
import { AppNavContextProvider } from '../contexts/appNavContext';
import chatloopTheme from '../assets/chatloopTheme';
import history from '../helpers/getBrowserHistory';

export const theme = createMuiTheme(chatloopTheme);

interface RootProps {
  children: Array<JSX.Element> | JSX.Element;
}

const Root: FC<RootProps> = ({ children }): JSX.Element => {
  return (
    <>
      <CssBaseline />
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <AppPropertiesProvider>
            <AppNavContextProvider>
              <UsersContextProvider>{children}</UsersContextProvider>
            </AppNavContextProvider>
          </AppPropertiesProvider>
        </ThemeProvider>
      </Router>
    </>
  );
};

export default Root;
