import { IAccountModel, IAddAccountModel } from '@data/use-cases/add-account/db-add-account-protocols'

export interface IAddAccountRepository {
  add: (account: IAddAccountModel) => Promise<IAccountModel>
}
