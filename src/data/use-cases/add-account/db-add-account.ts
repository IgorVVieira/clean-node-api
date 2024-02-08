import { type IAccountModel, type IAddAccount, type IAddAccountModel, type IEncrypter } from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  constructor(private readonly encrypter: IEncrypter) { }

  async execute(account: IAddAccountModel): Promise<IAccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => {
      resolve({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      })
    })
  }
}
