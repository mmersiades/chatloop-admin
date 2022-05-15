/// <reference types="cypress" />
import 'cypress-localstorage-commands';
import { AxiosResponse } from 'axios';

import admin from '../fixtures/users/admin.json';

declare global {
  namespace Cypress {
    interface Chainable {
      getAuthTokens(username: string, password: string): Promise<AxiosResponse>;
      visitUsersPage(): void;
      visitDashboardPage(): void;
      visitInvitesPage(): void;
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

Cypress.Commands.add('visitUsersPage', () => {
  cy.intercept('POST', '/rest/login').as('postLogin');
  cy.intercept('GET', '/rest/user/organisation').as('getOrganisations');
  cy.intercept('GET', '/rest/user/filter-users?role=ROLE_LEARNER').as(
    'getLearners'
  );
  cy.intercept('GET', '/rest/user/filter-users?role=ROLE_PARTNER').as(
    'getPartners'
  );
  cy.intercept(
    'GET',
    '/rest/user/filter-users?role=ROLE_TUTOR&shift=SHIFT_ONE'
  ).as('getTutors1');
  cy.intercept(
    'GET',
    '/rest/user/filter-users?role=ROLE_TUTOR&shift=SHIFT_TWO'
  ).as('getTutors2');
  cy.intercept('GET', '/rest/language').as('getLanguages');

  // noinspection JSIgnoredPromiseFromCall
  cy.getAuthTokens(admin.email, admin.password);
  cy.visit('/users');

  cy.wait('@postLogin');
  cy.wait('@getOrganisations');
  cy.wait('@getLearners');
  cy.wait('@getPartners');
  cy.wait('@getTutors1');
  cy.wait('@getTutors2');
  cy.wait('@getLanguages');
});

Cypress.Commands.add('visitDashboardPage', () => {
  cy.intercept('POST', '/rest/login').as('postLogin');
  cy.intercept('GET', '/rest/user/organisation').as('getOrganisations');
  cy.intercept('GET', '/rest/language').as('getLanguages');
  cy.intercept('GET', '/rest/admin/stats/dau?**').as('getDau');
  cy.intercept('GET', '/rest/admin/stats/mau?**').as('getMau');
  cy.intercept('GET', '/rest/admin/stats/cumulative-activities?**').as(
    'getCumulativeActivities'
  );
  cy.intercept('GET', '/rest/admin/stats/in-progress-activities?**').as(
    'getInProgressActivities'
  );
  cy.intercept('GET', '/rest/admin/stats/messages?**').as('getMessages');

  // noinspection JSIgnoredPromiseFromCall
  cy.getAuthTokens(admin.email, admin.password);
  cy.visit('/dashboard');

  cy.wait('@postLogin');
  cy.wait('@getOrganisations');
  cy.wait('@getLanguages');
  cy.wait('@getDau');
  cy.wait('@getMau');
  cy.wait('@getCumulativeActivities');
  cy.wait('@getInProgressActivities');
  cy.wait('@getMessages');
});

Cypress.Commands.add('visitInvitesPage', () => {
  cy.intercept('POST', '/rest/login').as('postLogin');
  cy.intercept('GET', '/rest/user/organisation').as('getOrganisations');
  cy.intercept('GET', '/rest/language').as('getLanguages');

  // noinspection JSIgnoredPromiseFromCall
  cy.getAuthTokens(admin.email, admin.password);
  cy.visit('/invites');

  cy.wait('@postLogin');
  cy.wait('@getOrganisations');
  cy.wait('@getLanguages');
});
