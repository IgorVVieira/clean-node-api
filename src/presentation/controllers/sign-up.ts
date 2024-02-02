import { MissinParamError, InvalidParamError } from '../errors/'
import { type HttpRequest, type HttpResponse } from '../protocols/http'
import { badRequest, serverError } from '../helpers/http-helper'
import { type IController } from './controller.interface'
import { type IEmailValidator } from '../protocols/email-validator'

export class SignUpController implements IController {
  constructor (private readonly emailValidator: IEmailValidator) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissinParamError(field))
        }
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email as string)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }
      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverError()
    }
  }
}
