// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-localstorage-commands';

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
