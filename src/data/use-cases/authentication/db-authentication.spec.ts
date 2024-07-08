import { DbAuthentication } from './db-authentication'

const loadAccountByEmailMock = {
  load: jest.fn()
}

const makeSut = (): DbAuthentication => new DbAuthentication(loadAccountByEmailMock)

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmail with correct email', async () => {
    const sut = makeSut()
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmailMock, 'load')
    const email = 'test@test.com'
    const password = 'test'

    await sut.auth(email, password)

    expect(loadAccountByEmailSpy).toHaveBeenCalledWith(email)
  })
})
