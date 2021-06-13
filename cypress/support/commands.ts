/// <reference types="cypress" />
import 'cypress-localstorage-commands';
import { AxiosResponse } from 'axios';

declare global {
  namespace Cypress {
    interface Chainable {
      getAuthTokens(username: string, password: string): Promise<AxiosResponse>;
      resetDb(): Promise<void>;
    }
  }
}

Cypress.Commands.add('getAuthTokens', (username: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_HOST')}/rest/login`,
    body: {
      username,
      password,
    },
  }).then(({ body }) => {
    cy.setLocalStorage('authToken', body.token);
    cy.setLocalStorage('loginToken', body.refreshToken);
    cy.setLocalStorage('tokensAddedAt', new Date().toString());
  });
});

Cypress.Commands.add('resetDb', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_HOST')}/rest/login`,
    body: {
      username: Cypress.env('E2E_USERNAME'),
      password: Cypress.env('E2E_PASSWORD'),
    },
  }).then(({ body }) => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_HOST')}/e2e/`,
      headers: {
        Authorization: `Bearer ${body.token}`,
      },
    }).then(({ body, status }) => {
      // Makes sure the test run stops if the db reset fails
      expect(status).to.equal(200);
      expect(body.code).to.equal('DB_RESET');
    });
  });
});
