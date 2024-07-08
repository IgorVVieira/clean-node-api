import { ILoadAccountByEmailRepository } from '@data/protocols/load-account-by-email-repository.interface'
import { IAuthentication } from '@domain/use-cases/authentication.interface'

export class DbAuthentication implements IAuthentication {
  public constructor(private readonly loadAccountByEmail: ILoadAccountByEmailRepository) { }

  public async auth(email: string, password: string): Promise<string> {
    await this.loadAccountByEmail.load(email)
    return 'test'
  }
}
