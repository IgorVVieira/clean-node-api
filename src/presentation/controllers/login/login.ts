import { badRequest } from '@presentation/helpers/http-helper'
import { HttpRequest, HttpResponse, IController } from '../signup/sign-up-protocols'
import { MissinParamError } from '@presentation/errors'

export class LoginController implements IController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissinParamError('email'))
  }
}
