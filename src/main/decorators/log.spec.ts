import { HttpRequest, HttpResponse, IController } from '@presentation/protocols'
import { serverError, sucess } from '@presentation/helpers/http-helper'
import { LogControllerDecorator } from './log'
import { ILogErrorRepository } from '@data/protocols/log-error-repository.interface'
import { IAccountModel } from '@domain/models/account'

const makeSut = (controller: IController, logErrorRepository?: ILogErrorRepository): IController => {
  logErrorRepository = logErrorRepository ?? makeLogErrorRepository()
  return new LogControllerDecorator(controller, logErrorRepository)
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'invalid_email',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'any@mail.com',
  password: 'any_password'
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async logError(stack: string): Promise<void> {
      await new Promise(resolve => { resolve(stack) })
    }
  }
  return new LogErrorRepositoryStub()
}

const makeFakeController = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => { resolve(sucess(makeFakeAccount)) })
    }
  }
  return new ControllerStub()
}

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    const controllerStub = makeFakeController()
    const sut = makeSut(controllerStub)

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const body = makeFakeRequest()
    await sut.handle(body)

    expect(handleSpy).toHaveBeenCalled()
    expect(handleSpy).toHaveBeenCalledWith(body)
  })

  it('should return the same result of the controller', async () => {
    const controllerStub = makeFakeController()
    const sut = makeSut(controllerStub)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(sucess(makeFakeAccount))
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const LogErrorRepositoryStub = makeLogErrorRepository()
    const controllerStub = makeFakeController()
    const sut = makeSut(controllerStub, LogErrorRepositoryStub)

    const fakeError = makeFakeServerError()

    const logSpy = jest.spyOn(LogErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(fakeError) }))

    await sut.handle(makeFakeRequest())

    expect(logSpy).toHaveBeenCalledWith(fakeError.body.stack)
  })
})
