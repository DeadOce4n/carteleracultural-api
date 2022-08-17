import { Model, Schema, model } from 'mongoose'
import { generatePasswordHash, checkPasswordHash } from '../utils/passwd'

export const roles = ['normal', 'admin', 'super'] as const
export type Role = typeof roles[number]

interface IUser {
  name: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
  role: Role,
  active: boolean,
  verified: boolean,
  registeredAt: Date,
  lastLogin: Date
}

interface IUserMethods {
  checkPasswordHash(password: string): Promise<boolean>
}

type UserModel = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: String,
  lastName: String,
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: roles },
  active: { type: Boolean, default: true },
  verified: { type: Boolean, default: false },
  registeredAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, required: false }
})

userSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  const newPassword = await generatePasswordHash(user.password)
  user.password = newPassword
  next()
})

userSchema.methods.checkPasswordHash = async function (password: string) {
  return checkPasswordHash(this.password, password)
}

export const User = model<IUser, UserModel>('User', userSchema)
