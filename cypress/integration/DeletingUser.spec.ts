import { DELETE_USER_DIALOG_TITLE } from '../../src/config/textConstants';

describe('Deleting a user', () => {
  const userEmail = 'newlearner1_0@email.com';
  beforeEach(() => {
    cy.intercept('DELETE', '/rest/user/hard-delete/**').as('deleteUser');
    cy.visitUsersPage();
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
    cy.wait('@deleteUser');
    cy.get('button[aria-label="Close drawer button"]').should('not.be.visible');
    cy.contains(userEmail).should('not.be.visible');
    cy.on('window:alert', (str) => {
      expect(str).to.equal('USER_DELETED');
    });
  });
});
