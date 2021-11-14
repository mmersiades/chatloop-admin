import { AxiosError } from 'axios';
import {
  CANCEL,
  RESET,
  RESET_PASSWORD,
  RESET_PASSWORD_DIALOG_TITLE,
} from '../../src/config/textConstants';
import admin from '../fixtures/users/admin.json';
import sara from '../fixtures/users/sara.json';

describe('Resetting a password', () => {
  beforeEach(() => {
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/users');
  });

  it("should reset a Learner's password", () => {
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

  it('should FAIL to reset password - 500 error', () => {
    const staticResponse = {
      statusCode: 500,
      body: {
        response: {
          data: 'something went wrong',
          status: '500',
          statusText: 'Internal server error',
        },
      },
    };
    cy.intercept(
      {
        method: 'POST',
        url: '/rest/user/password/reset',
      },
      staticResponse
    ).as('resetPassword');

    cy.contains(sara.displayName).click();
    cy.contains('button', RESET_PASSWORD).scrollIntoView();
    cy.contains('button', RESET_PASSWORD).click();
    cy.get('button[aria-label="Reset button"]').should('not.be.disabled');
    cy.get('button[aria-label="Reset button"]').click();

    cy.wait('@resetPassword');
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Password NOT reset. Something went wrong');
    });
    cy.contains('h2', RESET_PASSWORD_DIALOG_TITLE).should('not.exist');
  });
});
