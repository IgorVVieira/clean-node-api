import { InvalidParamError, ServerError } from '@presentation/errors'
import { IAccountModel, HttpRequest, IAddAccount, IAddAccountModel } from './sign-up-protocols'
import { SignUpController } from './sign-up'
import { badRequest, serverError, sucess } from '@presentation/helpers/http-helper'

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'any@mail.com',
  password: 'any_password'
})

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async execute(account: IAddAccountModel): Promise<IAccountModel> {
      return makeFakeAccount()
    }
  }
  return new AddAccountStub()
}

const makeSut = (addAccount?: IAddAccount): SignUpController => {
  addAccount = addAccount ?? makeAddAccount()
  return new SignUpController(addAccount, validateMock)
}

const validateMock = {
  validate: jest.fn()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'invalid_email',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

describe('SignUp Controller', () => {
  test('should call AddAccount with correct values', async () => {
    const addAccountStub = makeAddAccount()
    const sut = makeSut(addAccountStub)

    const addSpy = jest.spyOn(addAccountStub, 'execute')

    const httpRequest = makeFakeRequest()
    const { name, email, password } = httpRequest.body

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name,
      email,
      password
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const addAccountStub = makeAddAccount()
    jest.spyOn(addAccountStub, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })
    const sut = makeSut(addAccountStub)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  test('should return 200 if valid data is provided', async () => {
    const sut = makeSut()
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(sucess(makeFakeAccount()))
  })

  test('should call Validation with correct value', async () => {
    const addAccountStub = makeAddAccount()
    const sut = makeSut(addAccountStub)

    const validateSpy = jest.spyOn(validateMock, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if validation returns an error', async () => {
    const sut = makeSut()
    const httpRequest = makeFakeRequest()

    jest.spyOn(validateMock, 'validate').mockReturnValueOnce(new InvalidParamError('email'))

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
})
