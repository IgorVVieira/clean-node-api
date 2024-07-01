import { ValidationComposite } from '@presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'
import { RequiredFieldValidation } from '@presentation/helpers/validators/required-field-validation'
import { IValidation } from '@presentation/helpers/validators/validation.interface'
import { CompareFieldsValidation } from '@presentation/helpers/validators/compara-fields-validation'

jest.mock('@presentation/helpers/validators/validation-composite')

describe('SignUpValidation', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()

    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
