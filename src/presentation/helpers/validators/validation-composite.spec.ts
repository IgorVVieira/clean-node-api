import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { ValidationComposite } from './validation-composite'

const validationMock1 = {
  validate: jest.fn()
}

const validationMock2 = {
  validate: jest.fn()
}

describe('ValidationComposite', () => {
  it('should return an error if one of the validations fails', () => {
    validationMock1.validate.mockReturnValueOnce(new MissingParamError('field'))
    validationMock2.validate.mockReturnValueOnce(undefined)

    const sut = new ValidationComposite([validationMock1, validationMock2])

    const input = {}
    expect(sut.validate(input)).toEqual(new MissingParamError('field'))
  })

  it('should return the first error if multiple validations fail', () => {
    validationMock1.validate.mockReturnValueOnce(new MissingParamError('field1'))
    validationMock2.validate.mockReturnValueOnce(new InvalidParamError('field2'))

    const sut = new ValidationComposite([validationMock1, validationMock2])

    const input = {}
    expect(sut.validate(input)).toEqual(new MissingParamError('field1'))
  })

  it('should return undefined if all validations pass', () => {
    validationMock1.validate.mockReturnValueOnce(undefined)
    validationMock2.validate.mockReturnValueOnce(undefined)

    const sut = new ValidationComposite([validationMock1, validationMock2])

    const input = {}
    expect(sut.validate(input)).toBeUndefined()
  })
})
