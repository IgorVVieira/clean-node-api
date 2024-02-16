import { IAddAccountModel } from '@domain/use-cases/add-account.interface'

export interface IAccountModel extends IAddAccountModel {
  id: string
}
