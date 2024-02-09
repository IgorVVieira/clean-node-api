import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hashed_value'
  }
}))

describe('BcryptAdapter', () => {
  test('it should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const password = 'any_value'

    await sut.encrypt(password)
    expect(encryptSpy).toHaveBeenCalledWith(password, salt)
  })

  test('it should call return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const password = 'any_value'

    const hash = await sut.encrypt(password)
    expect(hash).toBe('hashed_value')
  })

  test('it should call return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const password = 'any_value'

    const hash = await sut.encrypt(password)
    expect(hash).toBe('hashed_value')
  })
})
