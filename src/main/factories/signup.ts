import { DbAddAccount } from '@data/use-cases/add-account/db-add-account'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '@infra/db/mongodb/account-respository/account'
import { LogControllerDecorator } from '@main/decorators/log'
import { SignUpController } from '@presentation/controllers/signup/sign-up'
import { IController } from '@presentation/protocols'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'

export const makeSignUpController = (): IController => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(new EmailValidatorAdapter(), dbAddAccount)

  return new LogControllerDecorator(signUpController)
}
