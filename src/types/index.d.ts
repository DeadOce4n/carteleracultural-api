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

declare module 'http' {
  interface IncomingMessage {
    get: (header: string) => string | undefined
  }
  interface ServerResponse {
    header: (header: string, value: number | string | object) => void
  }
}
