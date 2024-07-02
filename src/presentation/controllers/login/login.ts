import { badRequest, serverError, sucess, unauthorized } from '@presentation/helpers/http-helper'
import { HttpRequest, HttpResponse, IController } from '../signup/sign-up-protocols'
import { IAuthentication } from '@domain/use-cases/authentication.interface'
import { IValidation } from '@presentation/helpers/validators/validation.interface'

export class LoginController implements IController {
  public constructor(
    private readonly authentication: IAuthentication,
    private readonly validation: IValidation
  ) { }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
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
