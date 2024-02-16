import { MissinParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, sucesss } from '../../helpers/http-helper'
import { IEmailValidator, IController, HttpRequest, HttpResponse, IAddAccount } from './sign-up-protocols'

export class SignUpController implements IController {
  constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly addAccount: IAddAccount) {
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
      const account = await this.addAccount.execute({
        name,
        email,
        password
      })
      return sucesss(account)
    } catch (error) {
      return serverError()
    }
  }
}
