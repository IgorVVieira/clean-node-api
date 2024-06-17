import { badRequest, serverError, sucesss } from '@presentation/helpers/http-helper'
import { HttpRequest, HttpResponse, IController, IEmailValidator } from '../signup/sign-up-protocols'
import { InvalidParamError, MissingParamError } from '@presentation/errors'
import { IAuthentication } from '@domain/use-cases/authentication.interface'

export class LoginController implements IController {
  public constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly authentication: IAuthentication
  ) { }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body

      const isValidEmail = this.emailValidator.isValid(email as string)
      if (!isValidEmail) {
        return await new Promise(resolve => { resolve(badRequest(new InvalidParamError('email'))) })
      }

      const auth = await this.authentication.auth(email as string, password as string)

      return sucesss(auth)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
