import { badRequest, serverError, sucess, unauthorized } from '@presentation/helpers/http/http-helper'
import { HttpRequest } from '../signup/sign-up-protocols'
import { LoginController } from './login'
import { InvalidParamError } from '@presentation/errors'
const authenticationMock = {
  auth: jest.fn()
}

const validateMock = {
  validate: jest.fn()
}

const makeSut = (): LoginController => {
  return new LoginController(authenticationMock, validateMock)
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any@mail.com',
    password: 'any_password'
  }
})
describe('Login Controller', () => {
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

  test('should call Validation with correct value', async () => {
    const sut = makeSut()

    const validateSpy = jest.spyOn(validateMock, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const sut = makeSut()
    const httpRequest = makeFakeRequest()

    jest.spyOn(validateMock, 'validate').mockReturnValueOnce(new InvalidParamError('email'))

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
})
