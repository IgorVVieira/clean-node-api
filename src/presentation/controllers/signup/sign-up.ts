import { badRequest, serverError, sucess } from '@presentation/helpers/http/http-helper'
import { IController, HttpRequest, HttpResponse, IAddAccount } from './sign-up-protocols'
import { IValidation } from '@presentation/helpers/validators/validation.interface'

export class SignUpController implements IController {
  public constructor(
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation
  ) { }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body
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
