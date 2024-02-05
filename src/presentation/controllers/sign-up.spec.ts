import { InvalidParamError, MissinParamError, ServerError } from '../errors/'
import { type IEmailValidator, type HttpRequest } from '../protocols'
import { SignUpController } from './sign-up'

// interface SutTypes {
//   sut: SignUpController
//   emailValidatorStub: IEmailValidator
// }

const makeEmailValidator = (): IEmailValidator => {
  // Stub is a fake implementation of a class, always returning the same value
  class EmailValidatorStub implements IEmailValidator {
    isValid (_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (emailValidator: IEmailValidator): SignUpController => {
  return new SignUpController(emailValidator)
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const sut = makeSut(makeEmailValidator())
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const sut = makeSut(makeEmailValidator())
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    const sut = makeSut(makeEmailValidator())
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('password'))
  })

  test('should return 400 if no password confirmation is provided', () => {
    const sut = makeSut(makeEmailValidator())
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('passwordConfirmation'))
  })

  test('should return 400 if an invalid email is provided', () => {
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

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should return 400 if password confirmation fails', () => {
    const sut = makeSut(makeEmailValidator())
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirmation: 'different_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should call EmailValidator with correct email', () => {
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

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should return 500 if EmailValidator throws', () => {
    const emailValidatorStub = makeEmailValidator()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new ServerError()
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

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
