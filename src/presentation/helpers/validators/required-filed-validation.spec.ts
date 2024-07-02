import { MissingParamError } from '@presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => new RequiredFieldValidation('field')

describe('RequiredFieldValidation', () => {
  it('should return a MissingParamError if field is not present', () => {
    const sut = makeSut()
    const input = {}
    expect(sut.validate(input)).toEqual(new MissingParamError('field'))
  })

  it('should return undefined if field is present', () => {
    const sut = makeSut()
    const input = { field: 'value' }
    expect(sut.validate(input)).toBeUndefined()
  })
})
