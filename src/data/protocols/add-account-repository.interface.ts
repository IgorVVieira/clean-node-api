import { type IAccountModel, type IAddAccountModel } from '../use-cases/add-account/db-add-account-protocols'

export interface IAddAccountRepository {
  add: (account: IAddAccountModel) => Promise<IAccountModel>
}
