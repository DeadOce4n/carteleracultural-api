import { createHash } from 'crypto'
import bcrypt from 'bcrypt'

export const generatePasswordHash = async (password: string, rounds = 10): Promise<string> => {
  const hash = createHash('sha512')
  hash.update(password)
  const passwordHash = await bcrypt.hash(hash.digest('hex'), rounds)
  const buff = Buffer.from(passwordHash, 'utf8')
  const b64PasswdHash = buff.toString('base64')
  return b64PasswdHash
}

export const checkPasswordHash = async (passwordHash: string, password: string): Promise<boolean> => {
  const hash = createHash('sha512')
  hash.update(password)
  const buff = Buffer.from(passwordHash, 'base64')
  const decodedPasswordHash = buff.toString('utf8')
  const digest = hash.digest('hex')
  const match = await bcrypt.compare(digest, decodedPasswordHash)
  return match
}
