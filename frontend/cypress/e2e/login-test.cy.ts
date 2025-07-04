/// <reference types="cypress" />

describe('Login Test', () => {
  it('should login with valid credentials', () => {
    cy.visit('/login');
    cy.contains('Manage-me').should('be.visible');
    cy.get('input').should('have.length.at.least', 2);
    cy.get('input').first().type('tomek@manage-me.com');
    cy.get('input').eq(1).type('tomeksmialek');
    cy.contains('Log in').click();
    cy.url().should('include', '/');
    cy.contains('User:').should('be.visible');
    cy.contains('Logout').should('be.visible');
  });
});
