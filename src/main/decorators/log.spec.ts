import { HttpRequest, HttpResponse, IController } from '@presentation/protocols'
import { LogControllerDecorator } from './log'

const makeSut = (controller: IController): IController => {
  return new LogControllerDecorator(controller)
}

const makeFakeHttpResponse = (): HttpResponse => ({
  statusCode: 200,
  body: {
    id: 'any_id',
    name: 'any_name',
    email: 'test@mail.com'
  }
})

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
})
