import { Document } from 'mongodb'
import { MongoHelper } from '../helper/mongo'
import { IAddAccountRepository } from '@data/protocols/add-account-repository.interface'
import { IAccountModel } from '@domain/models/account'
import { IAddAccountModel } from '@domain/use-cases/add-account.interface'

export class AccountMongoRepository implements IAddAccountRepository {
  async add(account: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account as Document)

    return MongoHelper.toDomain<IAccountModel>(result, account)
  }
}
