import { badRequest } from '@presentation/helpers/http-helper'
import { LoginController } from './login'
import { MissinParamError } from '@presentation/errors'

const makeSut = (): LoginController => {
  return new LoginController()
}

describe('Login Controller', () => {
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
})
