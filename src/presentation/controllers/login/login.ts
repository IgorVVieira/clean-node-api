import { badRequest, sucesss } from '@presentation/helpers/http-helper'
import { HttpRequest, HttpResponse, IController, IEmailValidator } from '../signup/sign-up-protocols'
import { InvalidParamError, MissingParamError } from '@presentation/errors'

export class LoginController implements IController {
  public constructor(private readonly emailValidator: IEmailValidator) { }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))) })
    }
    if (!password) {
      return await new Promise(resolve => { resolve(badRequest(new MissingParamError('password'))) })
    }

    const isValidEmail = this.emailValidator.isValid(email as string)
    if (!isValidEmail) {
      return await new Promise(resolve => { resolve(badRequest(new InvalidParamError('email'))) })
    }

    return await new Promise(resolve => {
      resolve(sucesss({
        email, password
      }))
    })
  }
}
