describe('Example Test', () => {
  it('should visit the app', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});
