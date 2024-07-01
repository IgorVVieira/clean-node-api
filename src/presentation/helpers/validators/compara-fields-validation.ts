import { InvalidParamError } from '@presentation/errors'
import { IValidation } from './validation.interface'

export class CompareFieldsValidation implements IValidation {
  public constructor(private readonly fieldName: string, private readonly fieldToCompareName: string) { }

  public validate(input: any): Error | undefined {
    if (!input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
