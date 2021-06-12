// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

// import { PlaybookType } from '../../src/@types/enums';

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    // dataCy(value: string): Chainable<Element>
    getToken(): Promise<any>; // Actually a response from Keycloak
    resetDb(): Promise<any>; // Actually a graphql response
  }
}
