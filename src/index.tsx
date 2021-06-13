import React from 'react';
import 'typeface-lato';
import ReactDOM from 'react-dom';
import Root from './components/Root';
import App from './components/App';
import authService from './services/authServices';

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

const loginToken: string | null = localStorage.getItem('loginToken');

if (loginToken) {
  authService
    .loginWithToken()
    .then(() => renderApp())
    .catch(() => renderApp());
} else {
  renderApp();
}
