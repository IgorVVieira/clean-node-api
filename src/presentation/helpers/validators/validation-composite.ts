import { IValidation } from '../../protocols/validation.interface'

export class ValidationComposite implements IValidation {
  public constructor(private readonly validations: IValidation[]) { }

  public validate(input: any): Error | undefined {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
  }
}
