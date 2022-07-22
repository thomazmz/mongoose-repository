import mongoose, { Model } from 'mongoose'

export const createTestContext = (model: Model<any>) => {
  return {
    async openConnection() {
      return mongoose.connect('mongodb://admin:admin@localhost:27017')
    },
    async closeConnection() {
      return mongoose.connection.close()
    },
    async resetTestCollection(): Promise<void> {
      return model.remove({})
    },
    async seedTestCollection(entities: any[]) {
      return model.insertMany(entities)
    },
    async fetchTestCollection(): Promise<any[]> {
      return model.find()
    }
  }
}