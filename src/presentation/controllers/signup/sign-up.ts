import { MissingParamError, InvalidParamError } from '@presentation/errors'
import { badRequest, serverError, sucess } from '@presentation/helpers/http-helper'
import { IEmailValidator, IController, HttpRequest, HttpResponse, IAddAccount } from './sign-up-protocols'

export class SignUpController implements IController {
  public constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly addAccount: IAddAccount) {
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
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
      return sucess(account)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
