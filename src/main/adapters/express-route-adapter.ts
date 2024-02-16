import { HttpRequest, IController } from '@presentation/protocols'
import { Request, RequestHandler, Response } from 'express'

export const adaptRoute = (controller: IController): RequestHandler => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
