/// <reference types="cypress" />
import 'cypress-localstorage-commands';
import { AxiosResponse } from 'axios';

declare global {
  namespace Cypress {
    interface Chainable {
      // resetDb(): Promise<any>; // Actually a graphql response
      getAuthTokens(username: string, password: string): Promise<AxiosResponse>;
      getE2eTokens(): Promise<AxiosResponse>;
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

Cypress.Commands.add('getE2eTokens', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_HOST')}/rest/login`,
    body: {
      username: Cypress.env('E2E_USERNAME'),
      password: Cypress.env('E2E_PASSWORD'),
    },
  }).then(({ body }) => {
    console.log(`body`, body);
    cy.setLocalStorage('e2eAuthToken', body.token);
    cy.setLocalStorage('e2eLoginToken', body.refreshToken);
    cy.setLocalStorage('e2eTokensAddedAt', new Date().toString());
  });
});
