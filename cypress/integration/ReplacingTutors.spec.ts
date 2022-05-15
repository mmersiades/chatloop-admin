import { REPLACE_TUTOR } from '../../src/config/textConstants';
import sara from '../fixtures/users/sara.json';

describe('Replacing tutors', () => {
  beforeEach(() => {
    cy.intercept('GET', '/rest/admin/get-user/**').as('getUser');
    cy.intercept('POST', '/rest/admin/reassign-tutors-for-learner').as(
      'postReassignTutors'
    );
    cy.visitUsersPage();
  });

  it("should replace a Learner's Tutor", () => {
    cy.contains(sara.displayName).click();
    cy.wait('@getUser');
    cy.contains('button', REPLACE_TUTOR).scrollIntoView().should('be.visible');
    cy.get('li[data-testid="shift-one-tutor-box"]').within(() => {
      cy.contains('Heather').should('be.visible');
      cy.contains('tutor0@gmail.com').should('be.visible');
    });
    cy.contains('button', REPLACE_TUTOR).first().click();
    cy.get('input[type="radio"]').first().click();
    cy.wait('@getUser');
    cy.get('button[aria-label="confirm-replace-button"]').should(
      'not.be.disabled'
    );
    cy.contains('Replace Heather with tutor2?').should('be.visible');
    cy.get('button[aria-label="confirm-replace-button"]').click();
    cy.wait('@postReassignTutors');
    cy.wait('@getUser');
    cy.get('li[data-testid="shift-one-tutor-box"]').within(() => {
      cy.contains('tutor2').should('be.visible');
      cy.contains('tutor2@gmail.com').should('be.visible');
    });
  });
});
