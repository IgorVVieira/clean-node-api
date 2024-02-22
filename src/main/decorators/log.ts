// Decorator: A class que implementa a mesma interface que queremos decorar, e recebe a classe que queremos decorar no construtor.

import { HttpRequest, HttpResponse, IController } from '@presentation/protocols'

// O decorator é uma forma de adicionar funcionalidades a uma classe sem alterar o seu código. Principio do Open/Closed. SOLID
export class LogControllerDecorator implements IController {
  constructor(private readonly controller: IController) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      // log error
    }
    return httpResponse
  }
}
