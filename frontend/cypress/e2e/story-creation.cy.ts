/// <reference types="cypress" />

describe('Story Creation Tests', () => {
  let testData: any;

  before(() => {
    cy.fixture('testData').then(data => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.loginAsTestUser();
    cy.createProject(testData.project.name, testData.project.description);
    cy.contains(testData.project.name).click();
  });

  it('should create a story in a project', () => {
    cy.wait(3000);
    cy.url().should('include', '/project');
    cy.contains(testData.project.name).should('be.visible');

    cy.contains('Add story').click();

    cy.get('input').first().clear().type(testData.story.title);
    cy.get('textarea').first().clear().type(testData.story.description);

    cy.contains('Submit').click();
    cy.wait(1000);
    cy.contains(testData.story.title, { timeout: 15000 }).should('be.visible');
    cy.contains(testData.story.title).click();
    cy.wait(500);
    cy.contains(testData.story.title).should('be.visible');
  });

  afterEach(() => {
    cy.contains('Back').click();
    cy.wait(500);
    cy.contains('Back').click();
    cy.wait(500);
    cy.contains('Logout').click({ force: true });
  });
});
