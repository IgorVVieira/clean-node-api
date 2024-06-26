import { badRequest, serverError, sucess, unauthorized } from '@presentation/helpers/http-helper'
import { HttpRequest } from '../signup/sign-up-protocols'
import { LoginController } from './login'
import { InvalidParamError, MissingParamError } from '@presentation/errors'

const emailValidator = {
  isValid: jest.fn()
}

const authenticationMock = {
  auth: jest.fn()
}

const makeSut = (): LoginController => {
  return new LoginController(emailValidator, authenticationMock)
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any@mail.com',
    password: 'any_password'
  }
})

beforeEach(() => {
  emailValidator.isValid.mockReturnValue(true)
})

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        email: null
      }
    })
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        password: null
      }
    })
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const sut = makeSut()
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const sut = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call EmailValidator with correct email', async () => {
    const sut = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })

  test('Should call Authentication with correct values', async () => {
    const sut = makeSut()
    const authSpy = jest.spyOn(authenticationMock, 'auth')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith('any@mail.com', 'any_password')
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const sut = makeSut()
    jest.spyOn(authenticationMock, 'auth').mockResolvedValueOnce('')

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if IAuthentication throws', async () => {
    const sut = makeSut()
    jest.spyOn(authenticationMock, 'auth').mockResolvedValueOnce(Promise.reject(new Error()))

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if all credentials are provided', async () => {
    const sut = makeSut()

    jest.spyOn(authenticationMock, 'auth').mockResolvedValueOnce('any_token')

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(sucess({
      accessToken: 'any_token'
    }))
  })
})
