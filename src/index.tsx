import React from 'react';
import 'typeface-lato';
import ReactDOM from 'react-dom';
import Root from './components/Root';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import authService from './services/authServices';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

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
