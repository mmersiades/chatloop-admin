import React, { FC, ReactElement } from 'react';
import { Router } from 'react-router-dom';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { theme } from './components/Root';
import history from './helpers/getBrowserHistory';

const AllTheProviders: FC = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Router history={history}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Router>
    </>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
