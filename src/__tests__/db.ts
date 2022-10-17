import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

interface TestDb {
  mongod: MongoMemoryServer | null
  connect: () => Promise<void>
  closeDatabase: () => Promise<void>
  clearDatabase: () => Promise<void>
}

const db: TestDb = {
  mongod: null,
  async connect () {
    if (!this.mongod) {
      this.mongod = await MongoMemoryServer.create()
    }
    const uri = this.mongod.getUri()
    await mongoose.connect(uri, { minPoolSize: 10 })
  },
  async closeDatabase () {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    if (this.mongod) {
      await this.mongod.stop()
    }
  },
  async clearDatabase () {
    const { collections } = mongoose.connection
    for (const key in collections) {
      const collection = collections[key]
      try {
        await collection.drop()
      } catch (e: any) {
        if (e.message === 'ns not found') { continue }
        if (e.message === 'a background operation is currently running') { continue }
      }
    }
  }
}

export default db
