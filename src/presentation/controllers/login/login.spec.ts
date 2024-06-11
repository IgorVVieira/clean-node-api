import { badRequest } from '@presentation/helpers/http-helper'
import { HttpRequest } from '../signup/sign-up-protocols'
import { LoginController } from './login'
import { MissingParamError } from '@presentation/errors'

const emailValidator = {
  isValid: jest.fn()
}

const makeSut = (): LoginController => {
  return new LoginController(emailValidator)
}

beforeEach(() => {
  emailValidator.isValid.mockResolvedValue(true)
})

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    const httpRequest: HttpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })


})
