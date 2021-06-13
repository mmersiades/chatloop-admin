import {
  INVITES,
  INVITES_TITLE,
  NUMBERS,
  PARTNER_QUEUE,
} from '../../src/config/textConstants';
import admin from '../fixtures/users/admin.json';

describe('Using the Dashboard', () => {
  beforeEach(() => {
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/invites');
  });

  it('should render InvitesPage in initial state', () => {
    cy.contains(INVITES_TITLE).should('be.visible');
    cy.contains(INVITES).should('be.visible');
    cy.contains(PARTNER_QUEUE).should('be.visible');
    cy.contains(NUMBERS).should('be.visible');
    cy.get('li[data-testid="partner-queue-list-item"]').should(
      'have.length.greaterThan',
      5
    );
  });
});
