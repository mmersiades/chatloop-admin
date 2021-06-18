import React, { FC, ReactElement } from 'react';
import { Router } from 'react-router-dom';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { theme } from './components/Root';
import history from './helpers/getBrowserHistory';
import { AppPropertiesProvider } from './contexts/appPropertiesContext';

interface AllTheProvidersProps {
  children: JSX.Element;
}

const AllTheProviders: FC<AllTheProvidersProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <AppPropertiesProvider>{children}</AppPropertiesProvider>
        </ThemeProvider>
      </Router>
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) =>
  render(ui, {
    wrapper: (props: any) => <AllTheProviders {...props} {...options} />,
  });

export * from '@testing-library/react';

export { customRender as render };
