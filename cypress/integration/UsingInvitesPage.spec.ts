import {
  INVITES,
  INVITES_TITLE,
  NO_INVITES,
  NUMBERS,
  PARTNER_QUEUE,
} from '../../src/config/textConstants';
import admin from '../fixtures/users/admin.json';
import inviteResponse1 from '../fixtures/invitesResponses/inviteResponse1.json';

describe('Using the InvitesPage', () => {
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
      'have.length',
      5
    );
  });

  it('should fetch more queue on scroll', () => {
    cy.viewport(1000, 500);
    cy.get('li[data-testid="partner-queue-list-item"]').last().scrollIntoView();
    cy.get('li[data-testid="partner-queue-list-item"]').should(
      'have.length',
      10
    );
    cy.get('li[data-testid="partner-queue-list-item"]').last().scrollIntoView();
    cy.contains('End of queue').should('be.visible');
  });

  it('should show invite and delete it', () => {
    cy.intercept(`/rest/admin/invites`, {
      fixture: '/invitesResponses/inviteResponse1.json',
    });

    cy.contains(inviteResponse1.content[0].topic).should('be.visible');
    cy.contains('Expires:');

    // Check can expand invite
    cy.get('button[aria-label="show more"]').should('not.be.disabled');
    cy.get('button[aria-label="show more"]').click();
    cy.contains('strong', 'Sara').should('be.visible');

    cy.get('button[aria-label="show more"]').should('not.be.disabled');
    cy.get('button[aria-label="show more"]').click();

    // CHeck can delete invite
    cy.contains('button', 'DELETE').click();
    cy.contains(
      `Are you sure you want to delete invite ${inviteResponse1.content[0].id}?`
    ).should('be.visible');
    cy.contains('button', 'CANCEL').should('not.be.disabled');
    cy.contains('button', 'CANCEL').click();
    cy.contains(inviteResponse1.content[0].topic).should('be.visible');
    cy.contains('button', 'DELETE').should('not.be.disabled');
    cy.contains('button', 'DELETE').click();
    cy.intercept(
      'DELETE',
      `/rest/chatInvites/delete-invite/${inviteResponse1.content[0].id}`,
      'Invite-Deleted'
    );
    cy.intercept(`/rest/admin/invites`, {
      fixture: '/invitesResponses/inviteResponse2.json',
    });
    cy.get('button[aria-label="confirm-delete-button"]').should(
      'not.be.disabled'
    );
    cy.get('button[aria-label="confirm-delete-button"]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invite-Deleted');
    });
    cy.contains(NO_INVITES).should('be.visible');
  });

  it('should FAIL to delete invite - Invite not found', () => {
    cy.intercept(`/rest/admin/invites`, {
      fixture: '/invitesResponses/inviteResponse1.json',
    });

    cy.contains(inviteResponse1.content[0].topic).should('be.visible');
    cy.contains('button', 'DELETE').should('not.be.disabled');
    cy.contains('button', 'DELETE').click();
    cy.contains(
      `Are you sure you want to delete invite ${inviteResponse1.content[0].id}?`
    ).should('be.visible');
    cy.contains('button[aria-label="confirm-delete-button"]', 'DELETE').should(
      'not.be.disabled'
    );
    cy.contains('button[aria-label="confirm-delete-button"]', 'DELETE').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal(
        `failed to delete invite ${inviteResponse1.content[0].id}`
      );
    });
    cy.contains(inviteResponse1.content[0].topic).should('be.visible');
  });
});
