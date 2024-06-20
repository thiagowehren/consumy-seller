class RegisterForm {
  elements = {
    emailInput: () => cy.get('#input-1'),
    passwordInput: () => cy.get('#input-2')
  }
}

describe('Login', () => {
  describe('Submitting correct login valid inputs', () => {
    const input = {
      email:'seller1@example.com',
      password:'123456'
    }
    it('Given I am on the registration page Login', () => {
      cy.visit('/login')
    })

    it(`when i enter email`)
    it(`then i enter password`)
    it(`then i click on the submit button`)
    it(`then i `)
  })
})