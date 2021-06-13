import { LOG_OUT } from '../../src/config/textConstants';
import admin from '../fixtures/users/admin.json';
describe('Logging in as existing user', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should prevent logging in with bad password', () => {
    cy.get('input[aria-label="email field"]').type(admin.email);
    cy.get('input[aria-label="password field"]').type('wrong password');
    cy.get('button[type="submit"]').click();
    cy.url().should('equal', `${Cypress.config().baseUrl}/`);
    cy.contains('Incorrect email or password').should('be.visible');
  });

  it('should prevent logging in with bad username', () => {
    cy.get('input[aria-label="email field"]').type('wrong email');
    cy.get('input[aria-label="password field"]').type(admin.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('equal', `${Cypress.config().baseUrl}/`);
    // Check the browser native validation message is shown
    cy.get('input:invalid').should('have.length', 1);
  });

  it.only('should log an existing user in and then log them out', () => {
    cy.get('input[aria-label="email field"]').type(admin.email);
    cy.get('input[aria-label="password field"]').type(admin.password);
    cy.get('button[type="submit"]').click();
    cy.contains('Dashboard').should('be.visible');
    cy.url().should('contain', 'dashboard');

    cy.contains(LOG_OUT).click();
    cy.url().should('equal', `${Cypress.config().baseUrl}/`);
    cy.get('input[aria-label="email field"]').should('be.visible');
  });
});
