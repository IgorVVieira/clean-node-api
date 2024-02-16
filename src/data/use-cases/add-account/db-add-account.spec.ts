import { IAddAccount, IAddAccountModel, IEncrypter, DbAddAccount, IAccountModel, IAddAccountRepository } from './db-add-account-protocols'

const makeFakeAccountData = (): IAddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeSut = (encypter?: IEncrypter, addAccountRepository?: IAddAccountRepository): IAddAccount => {
  encypter = encypter ?? makeEncypter()
  addAccountRepository = addAccountRepository ?? makeAddAccountRepository()
  return new DbAddAccount(encypter, addAccountRepository)
}

export const makeEncypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

export const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(_account: IAddAccountModel): Promise<IAccountModel> {
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }
    }
  }
  return new AddAccountRepositoryStub()
}

describe('DbAddAccount UseCase', () => {
  test('should call Encrypter with correct password', async () => {
    const encrypterStub = makeEncypter()
    const sut = makeSut(encrypterStub)
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.execute(makeFakeAccountData())
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should throw if Encrypter throws', async () => {
    const encrypterStub = makeEncypter()
    const sut = makeSut(encrypterStub)
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    await expect(sut.execute(makeFakeAccountData())).rejects.toThrow()
  })

  test('should call AddAccountRepository with data', async () => {
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = makeSut(makeEncypter(), addAccountRepositoryStub)
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const data = makeFakeAccountData()
    await sut.execute(data)
    expect(addSpy).toHaveBeenCalledWith({
      ...data,
      password: 'hashed_password'
    })
  })

  test('should throw if AddAccountRepository throws', async () => {
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = makeSut(makeEncypter(), addAccountRepositoryStub)
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    await expect(sut.execute(makeFakeAccountData())).rejects.toThrow()
  })

  test('should call return correct account on success', async () => {
    const sut = makeSut()

    const data = makeFakeAccountData()
    const account = await sut.execute(data)

    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
