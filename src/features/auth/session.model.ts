import { Schema, model } from 'mongoose'
import { ISession } from '../../types/types'

const sessionSchema = new Schema<ISession>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  refreshToken: String
})

export const Session = model<ISession>('Session', sessionSchema)
