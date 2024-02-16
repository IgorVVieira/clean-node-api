import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@infra/db/mongodb/helper/mongo'

describe('Signup Routes', () => {
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

  test('should return an account on sucess', async () => {
    const account = {
      name: 'Igor',
      email: 'igor@mail.com',
      password: '12345678',
      passwordConfirmation: '12345678'
    }
    await request(app).post('/api/signup')
      .send(account)
      .expect(200)
  })
})
