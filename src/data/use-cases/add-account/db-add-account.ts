import { type IAccountModel } from '../../../domain/models/account'
import { type IAddAccountModel, type IAddAccount } from '../../../domain/use-cases/add-account.interface'
import { type IEncrypter } from '../../protocols/encypter.interface'

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
