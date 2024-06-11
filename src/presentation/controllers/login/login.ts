import { badRequest } from '@presentation/helpers/http-helper'
import { HttpRequest, HttpResponse, IController } from '../signup/sign-up-protocols'
import { MissingParamError } from '@presentation/errors'

export class LoginController implements IController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
  }
}
