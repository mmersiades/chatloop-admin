import { REPLACE_TUTOR } from '../../src/config/textConstants';
import admin from '../fixtures/users/admin.json';
import sara from '../fixtures/users/sara.json';

describe('Using the UsersPage', () => {
  beforeEach(() => {
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/users');
  });

  it("should replace a Learner's Tutor", () => {
    cy.contains(sara.displayName).click();
    cy.contains('button', REPLACE_TUTOR).scrollIntoView().should('be.visible');
    cy.get('li[data-testid="shift-one-tutor-box"]').within(() => {
      cy.contains('Heather').should('be.visible');
      cy.contains('tutor0@gmail.com').should('be.visible');
    });

    cy.contains('button', REPLACE_TUTOR).first().click();
    cy.get('input[type="radio"]').first().click();
    cy.get('button[aria-label="confirm-replace-button"]').should(
      'not.be.disabled'
    );
    cy.contains('Replace Heather with tutor2?').should('be.visible');
    cy.get('button[aria-label="confirm-replace-button"]').click();

    cy.get('li[data-testid="shift-one-tutor-box"]').within(() => {
      cy.contains('tutor2').should('be.visible');
      cy.contains('tutor2@gmail.com').should('be.visible');
    });
  });
});
