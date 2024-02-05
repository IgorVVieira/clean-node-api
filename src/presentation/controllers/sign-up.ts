import { type IAddAccount } from '../../domain/use-cases/add-account.interface'
import { MissinParamError, InvalidParamError } from '../errors/'
import { badRequest, serverError } from '../helpers/http-helper'
import { type IEmailValidator, type IController, type HttpRequest, type HttpResponse } from '../protocols/'

export class SignUpController implements IController {
  constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly addAccount: IAddAccount) {
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissinParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValidEmail = this.emailValidator.isValid(email as string)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = this.addAccount.execute({
        name,
        email,
        password
      })
      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return serverError()
    }
  }
}
