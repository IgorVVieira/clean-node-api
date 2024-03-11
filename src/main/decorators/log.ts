import { ILogErrorRepository } from '@data/protocols/log-error-repository.interface'
import { HttpRequest, HttpResponse, IController } from '@presentation/protocols'

// Decorator: A class que implementa a mesma interface que queremos decorar, e recebe a classe que queremos decorar no construtor.
// O decorator é uma forma de adicionar funcionalidades a uma classe sem alterar o seu código. Principio do Open/Closed. SOLID
export class LogControllerDecorator implements IController {
  constructor(
    private readonly controller: IController,
    private readonly logErrorRepository: ILogErrorRepository
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    console.log(httpResponse)
    if (httpResponse.statusCode === 500) {
      console.log('caiu no log')
      await this.logErrorRepository.log(httpResponse.body.stack as string)
    }
    return httpResponse
  }
}
