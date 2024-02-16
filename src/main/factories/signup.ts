import { DbAddAccount } from '@data/use-cases/add-account/db-add-account'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '@infra/db/mongodb/account-respository/account'
import { SignUpController } from '@presentation/controllers/signup/sign-up'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  return new SignUpController(new EmailValidatorAdapter(), dbAddAccount)
}
