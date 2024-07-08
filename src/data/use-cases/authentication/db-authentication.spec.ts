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

  it('Should throw if load account by email throws', async () => {
    const sut = makeSut()
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmailMock, 'load').mockImplementation(() => {
      throw new Error('test')
    })
    const email = 'test@test.com'
    const password = 'test'

    await expect(sut.auth(email, password)).rejects.toThrow('test')

    expect(loadAccountByEmailSpy).toHaveBeenCalledWith(email)
  })
})
