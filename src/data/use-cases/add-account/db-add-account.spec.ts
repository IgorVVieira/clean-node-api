import { type IAddAccount, type IAddAccountModel } from '../../../domain/use-cases/add-account.interface'
import { type IEncrypter } from '../../protocols/encypter.interface'
import { DbAddAccount } from './db-add-account'

const makeFakeAccountData = (): IAddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeSut = (encypter?: IEncrypter): IAddAccount => {
  encypter = encypter ?? makeEncypter()
  return new DbAddAccount(encypter)
}

export const makeEncypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

describe('DbAddAccount UseCase', () => {
  test('should call Encrypter with correct password', async () => {
    const encrypterStub = makeEncypter()
    const sut = makeSut(encrypterStub)
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.execute(makeFakeAccountData())
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
})
