import { Collection } from 'mongodb'
import { MongoHelper } from '../helper/mongo'
import { LogMongoRepository } from './log'

let errorCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(String(process.env.MONGO_URL))
  errorCollection = await MongoHelper.getCollection('errors')
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

afterEach(async () => {
  await errorCollection.deleteMany({})
})

describe('Log Mongo Repository', () => {
  test('should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')

    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})
