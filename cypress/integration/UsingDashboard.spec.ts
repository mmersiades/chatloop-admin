import admin from '../fixtures/users/admin.json';
describe('Using the Dashboard', () => {
  beforeEach(() => {
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/dashboard');
  });

  it('should render Dashboard in initial state', () => {
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Chatloop Admin').should('be.visible');
    cy.contains(Cypress.env('API_HOST')).should('be.visible');
  });
});
