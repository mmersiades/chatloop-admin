import {
  CANCEL,
  RESET,
  RESET_PASSWORD,
  RESET_PASSWORD_DIALOG_TITLE,
} from '../../src/config/textConstants';
import admin from '../fixtures/users/admin.json';
import sara from '../fixtures/users/sara.json';

describe('Using the UsersPage', () => {
  beforeEach(() => {
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/users');
  });

  it("should replace a Learner's Tutor", () => {
    cy.intercept({
      method: 'POST',
      url: '/rest/user/password/reset',
    }).as('resetPassword');
    cy.contains(sara.displayName).click();
    cy.contains('button', RESET_PASSWORD).scrollIntoView();
    cy.contains('button', RESET_PASSWORD).click();

    cy.contains('h2', RESET_PASSWORD_DIALOG_TITLE).should('be.visible');
    cy.get('button[aria-label="Reset button"]').should('be.visible');
    cy.contains('button', RESET).should('exist');
    cy.contains('button', CANCEL).should('be.visible');

    cy.contains('button', CANCEL).click();

    cy.contains('button', RESET_PASSWORD).click();

    cy.get('button[aria-label="Reset button"]').should('not.be.disabled');
    cy.get('button[aria-label="Reset button"]').click();

    cy.wait('@resetPassword').then(({ response }) =>
      expect(response.statusCode).to.equal(200)
    );
    cy.on('window:alert', (str) => {
      expect(str).to.equal('SUCCESS. A new password has been generated.');
    });
  });
});
