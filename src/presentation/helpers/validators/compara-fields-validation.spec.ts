import { InvalidParamError } from '@presentation/errors'
import { CompareFieldsValidation } from './compara-fields-validation'

const makeSut = (): CompareFieldsValidation => new CompareFieldsValidation('field', 'fieldToCompare')

describe('CompareFieldsValidation', () => {
  it('should return a InvalidParamError if field is not present', () => {
    const sut = makeSut()
    const input = { field: 'value', fieldToCompare: 'value2' }
    expect(sut.validate(input)).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('should return undefined if two fields are equal', () => {
    const sut = makeSut()
    const input = { field: 'value', fieldToCompare: 'value' }
    expect(sut.validate(input)).toBeUndefined()
  })
})
