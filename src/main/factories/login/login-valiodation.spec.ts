import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '@presentation/helpers/validators'
import { IValidation } from '@presentation/protocols/validation.interface'
import { IEmailValidator } from '@presentation/protocols/email-validator'
import { makeLoginValidation } from './login-validation'

jest.mock('@presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
describe('LoginValidation', () => {
  it('should call ValidationComposite with all validations', () => {
    makeLoginValidation()

    const validations: IValidation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation(makeEmailValidator(), 'email'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
