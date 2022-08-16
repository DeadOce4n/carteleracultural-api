import crypto from 'crypto'
import { promisify } from 'util'

const asyncRandomBytes = promisify(crypto.randomBytes)

export const generateRandomToken = async () => {
  const token = await asyncRandomBytes(32)
  return token.toString('hex')
}
