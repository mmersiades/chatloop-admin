import {
  INVITES,
  INVITES_TITLE,
  NO_INVITES,
  NUMBERS,
  PARTNER_QUEUE,
} from '../../src/config/textConstants';
import admin from '../fixtures/users/admin.json';
import inviteResponse1 from '../fixtures/invitesResponses/inviteResponse1.json';

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

  it('should show invite and delete it', () => {
    cy.intercept(`/rest/admin/invites`, {
      fixture: '/invitesResponses/inviteResponse1.json',
    });

    cy.contains(inviteResponse1.content[0].topic).should('be.visible');
    cy.contains('Expires: Sun, 1:50:40 pm');

    cy.contains('button', 'DELETE').click();
    cy.contains(
      `Are you sure you want to delete invite ${inviteResponse1.content[0].id}?`
    ).should('be.visible');
    cy.contains('button', 'CANCEL').click();
    cy.contains(inviteResponse1.content[0].topic).should('be.visible');
    cy.contains('button', 'DELETE').click();
    cy.intercept(
      'DELETE',
      `/rest/chatInvites/delete-invite/${inviteResponse1.content[0].id}`,
      'Invite-Deleted'
    );
    cy.intercept(`/rest/admin/invites`, {
      fixture: '/invitesResponses/inviteResponse2.json',
    });
    cy.get('button[aria-label="confirm-delete-button"]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invite-Deleted');
    });
    cy.contains(NO_INVITES).should('be.visible');
  });
});
