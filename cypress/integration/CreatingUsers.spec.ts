import admin from '../fixtures/users/admin.json';
import { OperatingSystem, TutorShift } from '../../src/@types/enums';
import { grey } from '@material-ui/core/colors';

describe('Creating new users', () => {
  const userDisplayName = 'fakename014';
  const userEmail = 'fakename014@gmail.com';
  beforeEach(() => {
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/users');
  });

  it('should create a Partner', () => {
    cy.clickTab('PARTNERS');
    cy.contains('button', 'ADD PARTNER').should('not.be.disabled');
    cy.contains('button', 'ADD PARTNER').click();

    // Check form initial state
    cy.contains('header', 'Add partner').should('be.visible');
    cy.get('button[aria-label="Close drawer button"]').should(
      'not.be.disabled'
    );
    cy.get('input[name="displayName"]').should('have.value', '');
    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="uiLanguage"]').should('have.value', '');
    cy.get('input[name="firstLanguage"]').should('have.value', '');
    cy.get('input[name="os"]').should('have.value', OperatingSystem.android);
    cy.contains('button[type="submit"]', 'SUBMIT').should('be.disabled');

    // Fill in form
    fillCommonFields(
      userDisplayName,
      userEmail,
      'English',
      'en',
      'English',
      'eng',
      OperatingSystem.android
    );

    cy.contains('button[type="submit"]', 'SUBMIT').should('not.be.disabled');
    cy.contains('button[type="submit"]', 'SUBMIT').click();

    // Check form reset
    cy.get('input[name="displayName"]').should('have.value', '');
    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="uiLanguage"]').should('have.value', '');
    // cy.get('input[name="firstLanguage"]').should('have.value', ''); // Value remaining as English
    cy.contains('button[type="submit"]', 'SUBMIT').should('be.disabled');

    // Check new user is in list
    cy.contains('tr', userDisplayName, { timeout: 12000 }).should('be.visible');
    cy.contains('tr', userEmail).should('be.visible');

    cy.deleteUser(userEmail);
  });

  it('should create a Tutor', () => {
    cy.clickTab('TUTORS');
    cy.contains('button', 'ADD TUTOR').should('not.be.disabled');
    cy.contains('button', 'ADD TUTOR').click();

    // Check form initial state
    cy.contains('header', 'Add tutor').should('be.visible');
    cy.contains(
      'div[aria-labelledby="tutor-shift-label-id mui-component-select-shift"]',
      'Shift One'
    ).should('be.visible');
    cy.get('input[name="shift"]').should('have.value', TutorShift.one);
    cy.contains('button[type="submit"]', 'SUBMIT').should('be.disabled');

    // Fill in form
    fillCommonFields(
      userDisplayName,
      userEmail,
      'English',
      'en',
      'English',
      'eng',
      OperatingSystem.ios
    );
    cy.contains(
      'div[aria-labelledby="tutor-shift-label-id mui-component-select-shift"]',
      'Shift One'
    ).click();
    cy.get('li[data-value="SHIFT_TWO"]').should('be.visible');
    cy.get('li[data-value="SHIFT_TWO"]').click();
    cy.get('input[name="shift"]').should('have.value', TutorShift.two);

    cy.contains('button[type="submit"]', 'SUBMIT').should('not.be.disabled');
    cy.contains('button[type="submit"]', 'SUBMIT').click();

    // Check new user is in list
    cy.contains('tr', userDisplayName, { timeout: 12000 }).should('be.visible');
    cy.contains('tr', userEmail).should('be.visible');

    cy.deleteUser(userEmail);
  });

  it('should create a Learner', () => {
    cy.clickTab('LEARNERS');
    cy.contains('button', 'ADD LEARNER').should('not.be.disabled');
    cy.contains('button', 'ADD LEARNER').click();

    // Check form initial state
    cy.contains('header', 'Add learner').should('be.visible');
    cy.get('input[name="shiftOneTutorId"]').should('have.value', 0);
    cy.get('input[name="shiftTwoTutorId"]').should('have.value', 0);

    cy.contains('button[type="submit"]', 'SUBMIT').should('be.disabled');

    // Fill in form
    fillCommonFields(
      userDisplayName,
      userEmail,
      'Persian',
      'fa',
      'Persian',
      'fas',
      OperatingSystem.android
    );
    cy.contains(
      'div[id="mui-component-select-shiftOneTutorId"]',
      'Select for shift one'
    ).click();
    cy.contains('li[role="option"]', 'tutor0@gmail.com').should('be.visible');
    cy.contains('li[role="option"]', 'tutor0@gmail.com').click();
    cy.contains(
      'div[id="mui-component-select-shiftTwoTutorId"]',
      'Select for shift two'
    ).click();
    cy.contains('li[role="option"]', 'tutor1@gmail.com').should('be.visible');
    cy.contains('li[role="option"]', 'tutor1@gmail.com').click();

    cy.contains('button[type="submit"]', 'SUBMIT').should('not.be.disabled');
    cy.contains('button[type="submit"]', 'SUBMIT').click();

    // Check new user is in list
    cy.contains('tr', userDisplayName, { timeout: 12000 }).should('be.visible');
    cy.contains('tr', userEmail).should('be.visible');

    cy.deleteUser(userEmail);
  });
});

const fillCommonFields = (
  name: string,
  email: string,
  uiLanguage: string,
  uiValue: string,
  firstLanguage: string,
  firstLanguageValue: string,
  osValue: string
) => {
  cy.get('input[name="displayName"]').type(name);
  cy.get('input[name="displayName"]').should('have.value', name);
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="email"]').should('have.value', email);
  cy.get('div[id="mui-component-select-uiLanguage"]').click();
  cy.get('ul[aria-labelledby="ui-language-label-id"]').within(() => {
    cy.contains('li', uiLanguage).click();
  });
  cy.get('input[name="uiLanguage"]').should('have.value', uiValue);

  cy.get('div[id="mui-component-select-os"]').click();
  cy.get('ul[aria-labelledby="os-label-id"]').within(() => {
    cy.contains('li', osValue.toLowerCase()).click();
  });
  cy.get('input[name="os"]').should('have.value', osValue);

  cy.get('div[aria-label="First language select"]', {
    timeout: 20000,
  }).click(); // TODO: Increase the performance of this Select
  cy.contains('button[type="submit"]', 'SUBMIT').should('be.disabled');
  cy.contains('div[role="menuitem"]', firstLanguage).scrollIntoView();
  cy.contains('div[role="menuitem"]', firstLanguage).click();
  cy.get('input[name="firstLanguage"]').should(
    'have.value',
    firstLanguageValue
  );
};
