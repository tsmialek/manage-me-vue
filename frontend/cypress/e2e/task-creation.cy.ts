/// <reference types="cypress" />

describe('Task Creation Tests', () => {
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
    cy.createStory(testData.story.title, testData.story.description);
    cy.contains(testData.story.title).click();
  });

  it('should create a task in a story', () => {
    cy.contains(testData.story.title).should('be.visible');

    cy.wait(3000);
    cy.contains('Create Task').should('be.visible').click();
    cy.get('input').first().clear().type(testData.task.title);
    cy.get('textarea').first().clear().type(testData.task.description);

    cy.contains('Submit').should('be.visible').click();
    cy.contains(testData.task.title, { timeout: 15000 }).should('be.visible');
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
