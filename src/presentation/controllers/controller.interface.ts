import { type HttpRequest, type HttpResponse } from '../protocols/http'

export interface IController {
  handle: (httpRequest: HttpRequest) => HttpResponse
}
