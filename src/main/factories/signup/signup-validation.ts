import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '@presentation/helpers/validators'
import { IValidation } from '@presentation/protocols/validation.interface'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'

export const makeSignUpValidation = (): IValidation => {
  const emailValidator = new EmailValidatorAdapter()

  const validations: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  validations.push(new EmailValidation(emailValidator, 'email'))

  return new ValidationComposite(validations)
}
