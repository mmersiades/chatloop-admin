import admin from '../fixtures/users/admin.json';
import {
  ACCOUNT_SETTINGS_TITLE,
  INVITES_TITLE,
  USERS_TITLE,
} from '../../src/config/textConstants';

describe('Navigating around the app', () => {
  beforeEach(() => {
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/dashboard');
  });

  it('should navigate to UsersPage', () => {
    cy.get('a[href="/users"]').click();
    cy.url().should('contain', '/users');
    cy.contains(USERS_TITLE).should('be.visible');
  });

  it('should navigate to InvitesPage', () => {
    cy.get('a[href="/invites"]').click();
    cy.url().should('contain', '/invites');
    cy.contains(INVITES_TITLE).should('be.visible');
  });

  it('should navigate to AccountSettings', () => {
    cy.get('a[href="/account-settings"]').click();
    cy.url().should('contain', '/account-settings');
    cy.contains(ACCOUNT_SETTINGS_TITLE).should('be.visible');
  });

  it('should navigate to Dashboard', () => {
    cy.get('a[href="/dashboard"]').click();
    cy.url().should('contain', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });
});
