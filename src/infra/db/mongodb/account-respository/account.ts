import { MongoHelper } from '../helper/mongo'
import { type IAddAccountRepository } from '../../../../data/protocols/add-account-repository.interface'
import { type IAccountModel } from '../../../../domain/models/account'
import { type IAddAccountModel } from '../../../../domain/use-cases/add-account.interface'

export class AccountMongoRepository implements IAddAccountRepository {
  async add(account: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)

    return {
      ...account,
      id: result.insertedId.toString()
    }
  }
}
