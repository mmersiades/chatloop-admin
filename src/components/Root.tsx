import React, { FC } from 'react';
import { Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { AppPropertiesProvider } from '../contexts/appPropertiesContext';
import { AppNavContextProvider } from '../contexts/appNavContext';
import { LanguagesContextProvider } from '../contexts/languagesContext';
import chatloopTheme from '../assets/chatloopTheme';
import history from '../helpers/getBrowserHistory';

export const theme = createTheme(chatloopTheme);

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
            <LanguagesContextProvider>
              <AppNavContextProvider>{children}</AppNavContextProvider>
            </LanguagesContextProvider>
          </AppPropertiesProvider>
        </ThemeProvider>
      </Router>
    </>
  );
};

export default Root;
