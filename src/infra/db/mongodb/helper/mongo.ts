import { type Collection, MongoClient } from 'mongodb'

export class MongoHelper {
  private static client: MongoClient

  static async connect(uri: string): Promise<void> {
    if (!this.client) {
      this.client = await MongoClient.connect(uri)
    }
  }

  static async disconnect(): Promise<void> {
    await this.client.close()
  }

  static async getCollection(name: string): Promise<Collection> {
    return this.client.db().collection(name)
  }

  static toDomain<T>(result: any, data: any): T {
    return {
      ...data,
      id: result.insertedId.toString()
    }
  }
}
