import admin from '../fixtures/users/admin.json';
import {
  INTERFACE_LANGUAGE,
  REFERRALS_TITLE,
  REFERRER_EMAIL,
  REFERRER_NAME,
} from '../../src/config/textConstants';

let totalReferrals = 36;
let pageSize = 25;

describe('Using the ReferralsPage', () => {
  beforeEach(() => {
    cy.intercept('POST', '/rest/login').as('postLogin');
    cy.intercept('GET', '/rest/referrals?**').as('getReferrals');
    cy.intercept('GET', '/rest/referrals/**').as('getReferral');
    cy.intercept('GET', '/rest/user/organisation').as('getOrganisations');
    cy.intercept('PUT', '/rest/referrals/**').as('putReferral');
    cy.intercept('DELETE', '/rest/referrals/**').as('deleteReferral');
    cy.intercept('POST', '/rest/referrals*').as('postReferrals');
    cy.intercept('GET', '/rest/language').as('getLanguages');
    cy.intercept('GET', '/json/?key=*', {
      status: 'success',
      country: 'Australia',
      countryCode: 'AU',
    }).as('ipLookup');
    cy.getAuthTokens(admin.email, admin.password);
    cy.visit('/referrals');

    cy.wait('@postLogin');
    cy.wait('@getOrganisations');
    cy.wait('@ipLookup');
    cy.wait('@getReferrals');
    cy.wait('@getLanguages');
  });

  describe('when reading referrals', () => {
    it('should render ReferralTable with pagination', () => {
      cy.contains(REFERRALS_TITLE).should('be.visible');
      cy.contains('learner').should('be.visible');
      cy.contains('partner').should('be.visible');
      cy.contains(`1-${pageSize} of ${totalReferrals}`).should('be.visible');
    });

    it('should change row size and navigate to next page', () => {
      const learnerRegex = new RegExp('learner');
      const partnerRegex = new RegExp('partner');
      cy.countElementsWithText('td', learnerRegex, 12);
      cy.get('td[data-test="pagination"]').within(() => {
        cy.get('div[aria-haspopup="listbox"]').click();
      });
      cy.get('[data-value="10"]').click();
      pageSize = 10;
      cy.wait('@getReferrals');
      cy.countElementsWithText('td', partnerRegex, 10);
      cy.contains(`1-${pageSize} of ${totalReferrals}`).should('be.visible');

      cy.get('button[aria-label="Next page"]').click();
      cy.wait('@getReferrals');
      cy.countElementsWithText('td', partnerRegex, 2);
      cy.countElementsWithText('td', learnerRegex, 8);
      cy.contains(`11-20 of ${totalReferrals}`).should('be.visible');
      pageSize = 25;
    });
  });

  describe('when creating a Referral with email only', () => {
    const refereeName = 'Bob';
    const refereeEmail = 'bob@email.com';

    it('should increase total number of table rows', () => {
      cy.get('.MuiFab-root').click();
      cy.get('input[name="refereeName"]').type(refereeName);
      cy.get('input[name="refereeEmail"]').type(refereeEmail);
      cy.get('#mui-component-select-role').click();
      cy.get('li[data-value="ROLE_LEARNER"]').click();
      // Ah, fuck it. How hard should it be to use react-select via Cypress?
      submitForm();
    });
  });

  describe('when creating a Referral with email and bad phone number', () => {
    const refereeName = 'Bob2';
    const refereeEmail = 'bob2@email.com';

    it('should show validation error then allow submit after phone number deleted', () => {
      cy.get('.MuiFab-root').click();
      cy.get('input[name="refereeName"]').type(refereeName);
      cy.get('input[name="refereeEmail"]').type(refereeEmail);
      cy.get('input[type="phone"]').type('32');
      cy.get('button[type="submit"]').click();
      cy.contains('refereePhone must be at least 8 characters');
      cy.get('input[type="phone"]').focus(); // Focus will clear error and value
      submitForm();
    });
  });

  describe('when creating a Referral with phone only', () => {
    const refereeName = 'Bob3';
    const refereePhone = '040533333';

    it('should increase total number of table rows', () => {
      cy.get('.MuiFab-root').click();
      cy.get('input[name="refereeName"]').type(refereeName);
      cy.get('input[type="phone"]').type(refereePhone).blur();
      submitForm();
    });
  });

  describe('when creating a Referral with phone and email', () => {
    const refereeName = 'Bob4';
    const refereeEmail = 'bob4@email.com';
    const refereePhone = '0405444444';

    it('should increase total number of table rows', () => {
      cy.get('.MuiFab-root').click();
      cy.get('input[name="refereeName"]').type(refereeName);
      cy.get('input[name="refereeEmail"]').type(refereeEmail);
      cy.get('input[type="phone"]').type(refereePhone);
      submitForm();
    });
  });

  describe('when updating a Referral', () => {
    it('should show the extended Referral info in drawer', () => {
      cy.get('tbody').within(() => {
        cy.get('tr').first().click();
      });

      cy.wait('@getReferral');

      cy.contains(REFERRER_EMAIL).scrollIntoView().should('be.visible');
      cy.contains(INTERFACE_LANGUAGE).should('be.visible');
      cy.contains(REFERRER_NAME).should('be.visible');
      cy.contains('ar').should('be.visible');
      cy.contains('Admin, of Chatloop').should('be.visible');
    });

    it('should change name and show new name in table', () => {
      const newName = 'Bobby';
      cy.get('tbody').within(() => {
        cy.get('tr').first().click();
      });

      cy.wait('@getReferral');

      cy.get('div[data-test="referral-drawer"]').within(() => {
        cy.get('input[name="refereeName"]').focus().clear().type(newName);
        cy.get('button[aria-label="Submit changes"]').scrollIntoView().click();
      });

      cy.wait('@putReferral');

      cy.get('tbody').within(() => {
        cy.contains(newName).scrollIntoView().should('be.visible');
      });

      cy.get('div[data-test="referral-drawer"]').within(() => {
        cy.get(`input[value=${newName}]`).should('be.visible');
      });
    });
  });

  describe('when deleting a Referral', () => {
    it('should reduce table rows by one', () => {
      cy.get('tbody').within(() => {
        cy.get('tr').first().click();
      });

      cy.get('button[aria-label="Delete referral"]').scrollIntoView().click();
      cy.wait('@deleteReferral');
      totalReferrals--;
      cy.contains(
        `1-${
          totalReferrals > pageSize ? pageSize : totalReferrals
        } of ${totalReferrals}`
      ).should('be.visible');
    });
  });
});

const submitForm = () => {
  cy.get('button[type="submit"]').click();
  cy.wait('@postReferrals');
  totalReferrals++;
  cy.contains(
    `1-${
      totalReferrals > pageSize ? pageSize : totalReferrals
    } of ${totalReferrals}`
  ).should('be.visible');
};
