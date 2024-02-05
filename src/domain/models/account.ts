import { type IAddAccountModel } from '../use-cases/add-account.interface'

export interface IAccountModel extends IAddAccountModel {
  id: string
}
