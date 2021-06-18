import { should } from 'chai';
import { DELETE_USER_DIALOG_TITLE } from '../../src/config/textConstants';
import admin from '../fixtures/users/admin.json';

describe('Using the UsersPage', () => {
  const userEmail = 'learner4@gmail.com';
  beforeEach(() => {
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/users');
  });

  it('should delete a user', () => {
    cy.contains(userEmail).click();
    cy.get('button[aria-label="Delete user button"]').scrollIntoView();
    cy.get('button[aria-label="Delete user button"]').click();
    cy.contains('h2', DELETE_USER_DIALOG_TITLE).should('be.visible');
    cy.get('button[aria-label="Confirm delete user button"]').should(
      'not.be.disabled'
    );

    cy.get('button[aria-label="Cancel button"]').click();
    cy.contains('h2', DELETE_USER_DIALOG_TITLE).should('not.exist');
    cy.get('button[aria-label="Delete user button"]').click();
    cy.get('button[aria-label="Confirm delete user button"]').click();
    cy.get('button[aria-label="Close drawer button"]').should('not.be.visible');
    cy.contains(userEmail).should('not.be.visible');
    cy.on('window:alert', (str) => {
      expect(str).to.equal('USER_DELETED');
    });
  });
});
