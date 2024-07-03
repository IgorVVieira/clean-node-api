import { RequiredFieldValidation, ValidationComposite, EmailValidation } from '@presentation/helpers/validators'
import { IValidation } from '@presentation/protocols/validation.interface'
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
