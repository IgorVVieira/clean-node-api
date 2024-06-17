import { InvalidParamError, MissingParamError, ServerError } from '@presentation/errors'
import { IEmailValidator, IAccountModel, HttpRequest, IAddAccount, IAddAccountModel } from './sign-up-protocols'
import { SignUpController } from './sign-up'
import { badRequest, serverError, sucess } from '@presentation/helpers/http-helper'

const makeEmailValidator = (): IEmailValidator => {
  // Stub is a fake implementation of a class, always returning the same value
  class EmailValidatorStub implements IEmailValidator {
    isValid(_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

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

const makeSut = (emailValidator?: IEmailValidator, addAccount?: IAddAccount): SignUpController => {
  emailValidator = emailValidator ?? makeEmailValidator()
  addAccount = addAccount ?? makeAddAccount()
  return new SignUpController(emailValidator, addAccount)
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
  test('should return 400 if no name is provided', async () => {
    const sut = makeSut()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.name

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if no password confirmation is provided', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const emailValidatorStub = makeEmailValidator()
    const sut = makeSut(emailValidatorStub)
    // spy on a method and mock its return value
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should return 400 if password confirmation fails', async () => {
    const sut = makeSut()

    const httpRequest = makeFakeRequest()
    httpRequest.body.passwordConfirmation = 'invalid_password'

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('should call EmailValidator with correct email', async () => {
    const emailValidatorStub = makeEmailValidator()
    const sut = makeSut(emailValidatorStub)
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should return 500 if EmailValidator throws', async () => {
    const emailValidatorStub = makeEmailValidator()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new ServerError('')
    })

    const sut = makeSut(emailValidatorStub)
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  test('should call AddAccount with correct values', async () => {
    const addAccountStub = makeAddAccount()
    const sut = makeSut(makeEmailValidator(), addAccountStub)

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
    const sut = makeSut(makeEmailValidator(), addAccountStub)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  test('should return 200 if valid data is provided', async () => {
    const sut = makeSut()
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(sucess(makeFakeAccount()))
  })
})
