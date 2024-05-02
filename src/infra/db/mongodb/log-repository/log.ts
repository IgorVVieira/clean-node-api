import { ILogErrorRepository } from '@data/protocols/log-error-repository.interface'
import { MongoHelper } from '../helper/mongo'

export class LogMongoRepository implements ILogErrorRepository {
  public async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
