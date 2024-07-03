import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '@presentation/helpers/validators'
import { makeSignUpValidation } from './signup-validation'
import { IValidation } from '@presentation/protocols/validation.interface'
import { IEmailValidator } from '@presentation/protocols/email-validator'

jest.mock('@presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
describe('SignUpValidation', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()

    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    validations.push(new EmailValidation(makeEmailValidator(), 'email'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
