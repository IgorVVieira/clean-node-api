import { EmailValidation } from '@presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '@presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '@presentation/helpers/validators/validation-composite'
import { IValidation } from '@presentation/helpers/validators/validation.interface'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'

export const makeLoginValidation = (): IValidation => {
  const emailValidator = new EmailValidatorAdapter()

  const validations: IValidation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation(emailValidator, 'email'))

  return new ValidationComposite(validations)
}
