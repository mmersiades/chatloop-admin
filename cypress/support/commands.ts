/// <reference types="cypress" />
import 'cypress-localstorage-commands';
import { AxiosResponse } from 'axios';

declare global {
  namespace Cypress {
    interface Chainable {
      getAuthTokens(username: string, password: string): Promise<AxiosResponse>;
      resetDb(): Promise<void>;
      clickTab(tabLabel: string): void;
      deleteUser(email: string): void;
      countElementsWithText(
        elemType: string,
        regex: RegExp,
        expectedCount: number
      ): void;
    }
  }
}

Cypress.Commands.add(
  'countElementsWithText',
  (elemType: string, regex: RegExp, expectedCount: number) => {
    cy.get(elemType)
      .filter((i, elem) => !!elem.innerText.match(regex))
      .should('have.length', expectedCount);
  }
);

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

Cypress.Commands.add('clickTab', (tabLabel: string) => {
  cy.contains('button[role="tab"]', tabLabel).should('not.be.disabled');
  cy.contains('button[role="tab"]', tabLabel).click();
  cy.contains('button[role="tab"]', tabLabel)
    .should('have.attr', 'aria-selected')
    .and('equal', 'true');
});

Cypress.Commands.add('deleteUser', (email: string) => {
  cy.contains('tr', email).click();
  cy.get('button[aria-label="Delete user button"]').scrollIntoView();
  cy.get('button[aria-label="Delete user button"]').click();
  cy.get('button[aria-label="Confirm delete user button"]').should(
    'not.be.disabled'
  );
  cy.get('button[aria-label="Confirm delete user button"]').click();
  cy.get('button[aria-label="Close drawer button"]').should('not.be.visible');
  cy.contains(email).should('not.be.visible');
});
