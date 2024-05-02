import { ILogErrorRepository } from '@data/protocols/log-error-repository.interface'
import { HttpRequest, HttpResponse, IController } from '@presentation/protocols'

// Decorator: A class que implementa a mesma interface que queremos decorar, e recebe a classe que queremos decorar no construtor.
// O decorator é uma forma de adicionar funcionalidades a uma classe sem alterar o seu código. Principio do Open/Closed. SOLID
export class LogControllerDecorator implements IController {
  public constructor(
    private readonly controller: IController,
    private readonly logErrorRepository: ILogErrorRepository
  ) { }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack as string)
    }
    return httpResponse
  }
}
