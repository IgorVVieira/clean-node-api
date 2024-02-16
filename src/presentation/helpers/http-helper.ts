import { ServerError } from '../errors'
import { HttpResponse } from '../protocols'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error.message
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})

export const sucesss = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
