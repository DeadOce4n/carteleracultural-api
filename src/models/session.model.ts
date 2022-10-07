import { Schema, model, Types } from 'mongoose'

interface ISession {
  user: Types.ObjectId,
  refreshToken: string
}

const sessionSchema = new Schema<ISession>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  refreshToken: String
})

export const Session = model<ISession>('Session', sessionSchema)
