import { badRequest, serverError, sucess, unauthorized } from '@presentation/helpers/http-helper'
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

      const accessToken = await this.authentication.auth(email as string, password as string)
      if (!accessToken) {
        return unauthorized()
      }

      return sucess({
        accessToken
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
