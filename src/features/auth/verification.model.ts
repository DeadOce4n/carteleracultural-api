import { Schema, model } from 'mongoose'
import { IVerification } from '../../types/types'

const verificationSchema = new Schema<IVerification>({
  email: String,
  code: String,
  createdAt: { type: Date, default: Date.now, expires: 600 }
})

export const Verification = model<IVerification>('Verification', verificationSchema)
