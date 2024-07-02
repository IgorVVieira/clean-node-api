import { CompareFieldsValidation } from '@presentation/helpers/validators/compara-fields-validation'
import { EmailValidation } from '@presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '@presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '@presentation/helpers/validators/validation-composite'
import { IValidation } from '@presentation/helpers/validators/validation.interface'
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
