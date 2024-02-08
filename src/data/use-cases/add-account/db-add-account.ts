import { type IAddAccountRepository, type IAccountModel, type IAddAccount, type IAddAccountModel, type IEncrypter } from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  constructor(
    private readonly encrypter: IEncrypter,
    private readonly addAccountRepository: IAddAccountRepository
  ) { }

  async execute(account: IAddAccountModel): Promise<IAccountModel> {
    const hashedPasword = await this.encrypter.encrypt(account.password)
    return await this.addAccountRepository.add({
      ...account,
      password: hashedPasword
    })
  }
}
