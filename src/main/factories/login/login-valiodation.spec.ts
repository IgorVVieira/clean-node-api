import { ValidationComposite } from '@presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '@presentation/helpers/validators/required-field-validation'
import { IValidation } from '@presentation/helpers/validators/validation.interface'
import { EmailValidation } from '@presentation/helpers/validators/email-validation'
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
