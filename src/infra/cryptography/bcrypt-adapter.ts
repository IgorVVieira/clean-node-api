import bcrypt from 'bcrypt'
import { IEncrypter } from '@data/protocols/encypter.interface'

export class BcryptAdapter implements IEncrypter {
  public constructor(private readonly salt: number) { }

  public async encrypt(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
