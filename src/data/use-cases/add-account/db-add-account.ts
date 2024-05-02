import { IAddAccountRepository, IAccountModel, IAddAccount, IAddAccountModel, IEncrypter } from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  public constructor(
    private readonly encrypter: IEncrypter,
    private readonly addAccountRepository: IAddAccountRepository
  ) { }

  public async execute(account: IAddAccountModel): Promise<IAccountModel> {
    const hashedPasword = await this.encrypter.encrypt(account.password)
    return await this.addAccountRepository.add({
      ...account,
      password: hashedPasword
    })
  }
}
