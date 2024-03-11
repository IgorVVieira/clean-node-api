import { HttpRequest, HttpResponse, IController } from '@presentation/protocols'
import { serverError } from '@presentation/helpers/http-helper'
import { LogControllerDecorator } from './log'
import { ILogErrorRepository } from '@data/protocols/log-error-repository.interface'

const makeSut = (controller: IController, logErrorRepository?: ILogErrorRepository): IController => {
  logErrorRepository = logErrorRepository ?? makeLogErrorRepository()
  return new LogControllerDecorator(controller, logErrorRepository)
}

const makeFakeHttpResponse = (): HttpResponse => ({
  statusCode: 200,
  body: {
    id: 'any_id',
    name: 'any_name',
    email: 'test@mail.com'
  }
})

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async log(stack: string): Promise<void> {
      await new Promise(resolve => { resolve(stack) })
    }
  }
  return new LogErrorRepositoryStub()
}

const makeFakeController = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => { resolve(makeFakeHttpResponse()) })
    }
  }
  return new ControllerStub()
}

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    const controllerStub = makeFakeController()
    const sut = makeSut(controllerStub)

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const body = {
      body: {
        name: 'any_name',
        email: 'any_email'
      }
    }
    await sut.handle(body)

    expect(handleSpy).toHaveBeenCalled()
    expect(handleSpy).toHaveBeenCalledWith(body)
  })

  it('should return the same result of the controller', async () => {
    const controllerStub = makeFakeController()
    const sut = makeSut(controllerStub)

    const httpResponse = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email'
      }
    })

    expect(httpResponse).toEqual(makeFakeHttpResponse())
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const LogErrorRepositoryStub = makeLogErrorRepository()
    const controllerStub = makeFakeController()
    const sut = makeSut(controllerStub, LogErrorRepositoryStub)

    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)

    const logSpy = jest.spyOn(LogErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(error) }))

    await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email'
      }
    })

    expect(logSpy).toHaveBeenCalledWith(fakeError.stack)
  })
})
