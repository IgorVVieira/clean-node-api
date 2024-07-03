import { InvalidParamError } from '@presentation/errors'
import { IValidation } from '../../protocols/validation.interface'
import { IEmailValidator } from '@presentation/protocols/email-validator'

export class EmailValidation implements IValidation {
  public constructor(private readonly emailValidator: IEmailValidator, private readonly fieldName: string) { }

  public validate(input: any): Error | undefined {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName] as string)
    if (!isValidEmail) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
