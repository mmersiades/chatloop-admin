import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/Root';
import App from './components/App';

import 'typeface-lato';

let hasRendered: boolean = false;

const jsx = (
  <Root>
    <App />
  </Root>
);

const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('root'));
    hasRendered = true;
  }
};

renderApp();
