import { CompareFieldsValidation } from '@presentation/helpers/validators/compara-fields-validation'
import { RequiredFieldValidation } from '@presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '@presentation/helpers/validators/validation-composite'
import { IValidation } from '@presentation/helpers/validators/validation.interface'

export const makeSignUpValidation = (): IValidation => {
  const validations: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  return new ValidationComposite(validations)
}
