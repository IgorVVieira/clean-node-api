import { InvalidParamError, ServerError } from '@presentation/errors'
import { EmailValidation } from './email-validation'
import { HttpRequest } from '@presentation/protocols'

const emailValidatorMock = {
  isValid: jest.fn()
}

const makeSut = (): EmailValidation => {
  return new EmailValidation(emailValidatorMock, 'email')
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'invalid_email',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

beforeEach(() => {
  emailValidatorMock.isValid.mockResolvedValue(true)
})

describe('EmailValidation', () => {
  test('should throw InvalidParamError if an invalid email is provided', () => {
    const sut = makeSut()
    jest.spyOn(emailValidatorMock, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeRequest()

    const error = sut.validate(httpRequest.body)
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorMock, 'isValid')

    const httpRequest = makeFakeRequest()

    sut.validate(httpRequest.body)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should throw if EmailValidator throws', () => {
    jest.spyOn(emailValidatorMock, 'isValid').mockImplementation(() => { throw new ServerError('') })

    const httpRequest = makeFakeRequest()

    const sut = makeSut()
    try {
      sut.validate(httpRequest.body)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })
})
