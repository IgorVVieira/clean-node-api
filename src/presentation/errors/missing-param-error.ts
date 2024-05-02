export class MissinParamError extends Error {
  public constructor(paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissinParamError'
  }
}
