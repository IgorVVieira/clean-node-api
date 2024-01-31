import { MissinParamError } from '../errors/missing-param-error'
import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
import { type IController } from './controller.interface'

export class SignUpController implements IController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissinParamError(field))
      }
    }
    return {
      statusCode: 200,
      body: {}
    }
  }
}
