import { badRequest } from '@presentation/helpers/http-helper'
import { HttpRequest, HttpResponse, IController } from '../signup/sign-up-protocols'
import { MissinParamError } from '@presentation/errors'

export class LoginController implements IController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissinParamError('email'))
    }
    if (!httpRequest.body.password) {
      return badRequest(new MissinParamError('password'))
    }
    return await new Promise(resolve => {
      resolve({
        statusCode: 200,
        body: {
          message: 'ok'
        }
      })
    })
  }
}
