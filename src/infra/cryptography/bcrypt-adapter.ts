import bcrypt from 'bcrypt'
import { type IEncrypter } from '../../data/protocols/encypter.interface'

export class BcryptAdapter implements IEncrypter {
  constructor(private readonly salt: number) { }

  async encrypt(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
