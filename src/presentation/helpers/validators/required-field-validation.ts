import { MissingParamError } from '@presentation/errors'
import { IValidation } from './validation.interface'

export class RequiredFieldValidation implements IValidation {
  public constructor(private readonly fieldName: string) { }

  public validate(input: any): Error | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
