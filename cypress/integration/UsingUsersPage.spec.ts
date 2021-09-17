import {
  CURRENT_ACTIVITIES,
  DELETE,
  DISPLAY_NAME,
  EMAIL,
  FIRST_LANGUAGE,
  INTERFACE_LANGUAGE,
  LEARNERS_TAB,
  PARTNERS_TAB,
  REPLACE_TUTOR,
  RESET_PASSWORD,
  SHIFT_ONE_TUTOR,
  SHIFT_TWO_TUTOR,
  TUTORS_TAB,
  USERS_TITLE,
} from '../../src/config/textConstants';
import admin from '../fixtures/users/admin.json';
import sara from '../fixtures/users/sara.json';

describe('Using the UsersPage', () => {
  beforeEach(() => {
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/users');
  });

  it('should render UsersPage in initial state', () => {
    cy.contains(USERS_TITLE).should('be.visible');
    cy.contains('button', LEARNERS_TAB).should('have.attr', {
      'aria-selected': true,
    });
    cy.contains(PARTNERS_TAB).should('be.visible');
    cy.contains(TUTORS_TAB).should('be.visible');
    // cy.contains('button', 'Add Learner').should('be.visible');
    cy.contains(sara.email).should('be.visible');
    cy.contains('1-7 of 7').should('be.visible');
  });

  it('should show Partners and Tutors lists', () => {
    cy.contains('button', PARTNERS_TAB).click();
    cy.contains('partner@gmail.com').should('be.visible');
    cy.contains('1-16 of 16').should('be.visible');

    cy.contains('button', TUTORS_TAB).click();
    cy.contains('tutor0@gmail.com').should('be.visible');
    cy.contains('SHIFT_ONE').should('be.visible');
    cy.contains('1-3 of 3').should('be.visible');
  });

  it("should show a Learner's details", () => {
    cy.contains(sara.displayName).click();

    cy.contains(DISPLAY_NAME).should('be.visible');
    cy.contains(EMAIL).should('be.visible');
    cy.contains(FIRST_LANGUAGE).should('be.visible');
    cy.contains(INTERFACE_LANGUAGE).should('be.visible');
    cy.contains(CURRENT_ACTIVITIES).should('be.visible');
    cy.contains(SHIFT_ONE_TUTOR).should('be.visible');
    cy.contains(SHIFT_TWO_TUTOR).should('be.visible');
    cy.contains('button', REPLACE_TUTOR).scrollIntoView().should('be.visible');
    cy.contains('button', RESET_PASSWORD).scrollIntoView().should('be.visible');
    cy.contains('button', DELETE).scrollIntoView().should('be.visible');
  });
});
