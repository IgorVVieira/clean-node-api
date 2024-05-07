import { badRequest } from '@presentation/helpers/http-helper'
import { HttpRequest, HttpResponse, IController, IEmailValidator } from '../signup/sign-up-protocols'
import { InvalidParamError, MissinParamError } from '@presentation/errors'

export class LoginController implements IController {
  public constructor(private readonly emailValidator: IEmailValidator) { }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) {
      return badRequest(new MissinParamError('email'))
    }
    if (!password) {
      return badRequest(new MissinParamError('password'))
    }

    const isValidEmail = this.emailValidator.isValid(email as string)

    if (!isValidEmail) {
      return badRequest(new InvalidParamError('email'))
    }
    return await new Promise(resolve => {
      resolve({
        statusCode: 200,
        body: {
          message: 'ok'
        }
      })
    })
  }
}
