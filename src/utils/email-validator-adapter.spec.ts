import { EmailValidatorAdapter } from './email-validator'

describe('EmailValidatorAdapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email')
    expect(isValid).toBe(false)
  })

  test('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email')
    expect(isValid).toBe(false)
  })
})
