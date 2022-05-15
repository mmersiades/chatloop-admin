import {
  ACTIVITIES_IN_PROGRESS_TITLE,
  CUMULATIVE_ACTIVITIES_TITLE,
  DAU_TITLE,
  MAU_TITLE,
  MESSAGES_TITLE,
} from '../../src/config/textConstants';

describe('Using the Dashboard', () => {
  beforeEach(() => {
    cy.visitDashboardPage();
  });

  it('should render Dashboard in initial state', () => {
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Chatloop Admin').should('be.visible');
    cy.contains(Cypress.env('API_HOST')).should('be.visible');
    cy.contains(DAU_TITLE).should('be.visible');
    cy.contains(MAU_TITLE).should('be.visible');
    cy.contains(ACTIVITIES_IN_PROGRESS_TITLE).should('be.visible');
    cy.contains(CUMULATIVE_ACTIVITIES_TITLE).should('be.visible');
    cy.contains(MESSAGES_TITLE).should('be.visible');
  });
});

export default {};
