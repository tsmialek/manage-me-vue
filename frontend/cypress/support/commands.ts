/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to get element by data-testid
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to login with default test credentials
       * @example cy.loginAsTestUser()
       */
      loginAsTestUser(): Chainable<void>;

      /**
       * Custom command to create a new project
       * @example cy.createProject('Test Project', 'Test Description')
       */
      createProject(
        name: string,
        description: string,
        priority?: string
      ): Chainable<void>;

      /**
       * Custom command to create a new story
       * @example cy.createStory('Test Story', 'Test Description')
       */
      createStory(title: string, description: string): Chainable<void>;

      /**
       * Custom command to create a new task
       * @example cy.createTask('Test Task', 'Test Description')
       */
      createTask(
        title: string,
        description: string,
        priority?: string,
        estimatedHours?: string
      ): Chainable<void>;
    }
  }
}

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('loginAsTestUser', () => {
  cy.fixture('testData').then(data => {
    cy.visit('/login');
    cy.contains('Manage-me').should('be.visible');
    cy.get('input').should('have.length.at.least', 2);
    cy.get('input').first().type(data.user.email);
    cy.get('input').eq(1).type(data.user.password);
    cy.contains('Log in').click();
    cy.url().should('include', '/');

    cy.wait(1000);
    cy.get('body').should('not.have.class', 'slide-enter-from');
    cy.get('body').should('not.have.class', 'slide-enter-active');

    cy.get('body').should('contain', 'User:');
  });
});

Cypress.Commands.add(
  'createProject',
  (name: string, description: string, priority: string = 'Medium') => {
    cy.visit('/');
    cy.wait(1000);

    cy.contains('Add project').should('be.visible').click();
    cy.get('#modal-body').should('be.visible');
    cy.wait(1000);
    cy.get('#modal-main-content').within(() => {
      cy.get('input').first().should('be.visible').type(name);
      cy.get('textarea').first().should('be.visible').type(description);
    });

    cy.contains('Submit').should('be.visible').click();
    cy.wait(1500);
    cy.contains(name, { timeout: 15000 }).should('be.visible');
  }
);

Cypress.Commands.add('createStory', (title: string, description: string) => {
  cy.wait(3000);
  cy.url().should('include', '/project');

  cy.contains('Add story').click();

  cy.get('input').first().clear().type(title);
  cy.get('textarea').first().clear().type(description);

  cy.contains('Submit').click();
  cy.wait(1000);
  cy.contains(title, { timeout: 15000 }).should('be.visible');
});

Cypress.Commands.add(
  'createTask',
  (
    title: string,
    description: string,
    priority: string = 'Low',
    estimatedHours: string = '2'
  ) => {
    cy.contains('Create Task').should('be.visible').click();

    cy.wait(500);

    cy.get('input').first().type(title);
    cy.get('body').then($body => {
      if ($body.find('textarea').length > 0) {
        cy.get('textarea').first().type(description);
      } else {
        cy.get('input').eq(1).type(description);
      }
    });

    cy.get('body').then($body => {
      if ($body.find('select').length > 0) {
        cy.get('select').first().click();
        cy.contains(priority).click();
      }
      if ($body.find('input[type="number"]').length > 0) {
        cy.get('input[type="number"]').type(estimatedHours);
      }
    });

    cy.contains('Create Task').should('be.visible').click();

    cy.wait(2000);
    cy.contains(title, { timeout: 10000 }).should('be.visible');
  }
);

export {};
