import {
  ACTIVITIES_IN_PROGRESS_TITLE,
  ACTIVITY_CAPACITY_TITLE,
  CUMULATIVE_ACTIVITIES_TITLE,
  DAU_TITLE,
  LEARNER_CAPACITY_TITLE,
  MAU_TITLE,
  MESSAGES_TITLE,
  OAI_TITLE,
  OAR_TITLE,
  OER_TITLE,
  OOA_TITLE,
  OR_TITLE,
  TAR_TITLE,
  TCR_TITLE,
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
    cy.contains(TAR_TITLE).should('be.visible');
    cy.contains(TCR_TITLE).should('be.visible');
    cy.contains(OR_TITLE).should('be.visible');
    cy.contains(OOA_TITLE).should('be.visible');
    cy.contains(OAR_TITLE).should('be.visible');
    cy.contains(OER_TITLE).should('be.visible');
    cy.contains(OAI_TITLE).should('be.visible');
    cy.contains(LEARNER_CAPACITY_TITLE).should('be.visible');
    cy.contains(ACTIVITY_CAPACITY_TITLE).should('be.visible');
  });
});
