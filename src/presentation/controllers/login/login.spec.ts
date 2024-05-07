import { badRequest } from '@presentation/helpers/http-helper'
import { LoginController } from './login'
import { MissinParamError } from '@presentation/errors'

const emailValidator = {
  isValid: jest.fn()
}

const makeSut = (): LoginController => {
  return new LoginController(emailValidator)
}

describe('Login Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    emailValidator.isValid.mockReturnValue(true)
  })
  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissinParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissinParamError('password')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissinParamError('password')))
  })
})
