import { MongoHelper } from '../helper/mongo'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  afterEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('should return an account on success', async () => {
    const sut = makeSut()
    const mockAccount = {
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    }
    const account = await sut.add(mockAccount)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(mockAccount.name)
    expect(account.email).toBe(mockAccount.email)
  })
})
