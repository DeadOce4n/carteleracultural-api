import { ObjectId } from 'mongoose'

declare global {
  namespace Express {
    interface User {
      _id: ObjectId
      role: string
    }
    interface Request {
      filters: any
    }
  }
}
