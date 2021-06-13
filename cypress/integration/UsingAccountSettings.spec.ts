import {
  ACCOUNT_SETTINGS_TITLE,
  PASSWORD_LABEL,
} from '../../src/config/textConstants';
import admin from '../fixtures/users/admin.json';

describe('Using the AccountSettings', () => {
  beforeEach(() => {
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/account-settings');
  });

  it('should render AccountSettings in initial state', () => {
    cy.contains(ACCOUNT_SETTINGS_TITLE).should('be.visible');
    cy.contains(PASSWORD_LABEL).should('be.visible');
    cy.get('button[aria-label="edit-password-button"]').should('be.visible');
  });

  it('should change password', () => {
    cy.intercept('POST', '/rest/user/password').as('changePasswordReq');
    cy.get('button[aria-label="edit-password-button"]').click();

    cy.get('input[name="currentPassword"]').type(admin.password);
    cy.get('input[name="currentPassword"]').should(
      'have.value',
      admin.password
    );

    cy.get('button[aria-label="Toggle password visibility"]').click({
      multiple: true,
    });
    cy.get('input[name="currentPassword"]').should('have.attr', {
      type: 'text',
    });

    cy.get('input[name="newPassword"]').type(admin.password);
    cy.get('input[name="newPassword"]').should('have.value', admin.password);

    cy.get('input[name="confirmPassword"]').type(admin.password);
    cy.get('input[name="confirmPassword"]').should(
      'have.value',
      admin.password
    );

    cy.get('button[aria-label="submit-form-button"]').should('not.be.disabled');
    cy.get('button[aria-label="submit-form-button"]').click();
    cy.wait('@changePasswordReq')
      .its('response.statusCode')
      .should('equal', 200);
  });
});
