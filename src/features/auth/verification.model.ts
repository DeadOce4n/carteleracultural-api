import { Schema, model } from 'mongoose'

interface IVerification {
  email: string,
  code: string,
  createdAt: Date,
}

const verificationSchema = new Schema<IVerification>({
  email: String,
  code: String,
  createdAt: { type: Date, default: Date.now, expires: 600 }
})

export const Verification = model<IVerification>('Verification', verificationSchema)
