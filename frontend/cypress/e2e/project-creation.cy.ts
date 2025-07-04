/// <reference types="cypress" />

describe('Project Creation Test', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
  });

  it('should create a project using modal form', () => {
    cy.fixture('testData').then(data => {
      cy.visit('/');
      cy.wait(1000);

      cy.contains('Add project').should('be.visible').click();
      cy.get('#modal-body').should('be.visible');
      cy.wait(1000);
      cy.get('#modal-main-content').within(() => {
        cy.get('input').first().should('be.visible').type(data.project.name);
        cy.get('textarea')
          .first()
          .should('be.visible')
          .type(data.project.description);
      });

      cy.contains('Submit').should('be.visible').click();
      cy.wait(1500);
      cy.contains(data.project.name, { timeout: 15000 }).should('be.visible');

      cy.contains(data.project.name).click();
      cy.url().should('include', '/project');
    });
  });

  afterEach(() => {
    cy.contains('Logout').click({ force: true });
  });
});
