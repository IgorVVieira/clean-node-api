import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('BcryptAdapter', () => {
  test('it should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const password = 'any_value'

    const test = await sut.encrypt(password)
    console.log(test)
    expect(encryptSpy).toHaveBeenCalledWith(password, salt)
  })
})
