import { InvalidParamError, MissinParamError, ServerError } from '@presentation/errors'
import { IEmailValidator, IAccountModel, HttpRequest, IAddAccount, IAddAccountModel } from './sign-up-protocols'
import { SignUpController } from './sign-up'

const makeEmailValidator = (): IEmailValidator => {
  // Stub is a fake implementation of a class, always returning the same value
  class EmailValidatorStub implements IEmailValidator {
    isValid(_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async execute(account: IAddAccountModel): Promise<IAccountModel> {
      return {
        id: 'valid_id',
        name: account.name,
        email: account.email,
        password: account.password
      }
    }
  }
  return new AddAccountStub()
}

const makeSut = (emailValidator?: IEmailValidator, addAccount?: IAddAccount): SignUpController => {
  emailValidator = emailValidator ?? makeEmailValidator()
  addAccount = addAccount ?? makeAddAccount()
  return new SignUpController(emailValidator, addAccount)
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('name'))
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('email'))
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('password'))
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('passwordConfirmation'))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const emailValidatorStub = makeEmailValidator()
    const sut = makeSut(emailValidatorStub)
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // spy on a method and mock its return value
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should return 400 if password confirmation fails', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirmation: 'different_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should call EmailValidator with correct email', async () => {
    const emailValidatorStub = makeEmailValidator()
    const sut = makeSut(emailValidatorStub)
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // spy on a method and mock its return value
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should return 500 if EmailValidator throws', async () => {
    const emailValidatorStub = makeEmailValidator()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new ServerError('')
    })
    const sut = makeSut(emailValidatorStub)
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toBeInstanceOf(ServerError)
  })

  test('should call AddAccount with correct values', async () => {
    const addAccountStub = makeAddAccount()
    const sut = makeSut(makeEmailValidator(), addAccountStub)
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const { name, email, password } = httpRequest.body
    // spy on a method and mock its return value
    const addSpy = jest.spyOn(addAccountStub, 'execute')

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
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('should return 200 if valid data is provided', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'any_name',
      email: 'any@mail.com',
      password: 'any_password'
    })
  })
})
