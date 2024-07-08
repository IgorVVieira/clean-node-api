import { DbAuthentication } from './db-authentication'

const loadAccountByEmailMock = {
  load: jest.fn()
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmail with correct email', async () => {
    const sut = new DbAuthentication(loadAccountByEmailMock)
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmailMock, 'load')
    const email = 'test@test.com'
    const password = 'test'

    await sut.auth(email, password)

    // Assert
    expect(loadAccountByEmailSpy).toHaveBeenCalledWith(email)
  })
})
