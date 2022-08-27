import crypto from 'crypto'
import { promisify } from 'util'
import dayjs from 'dayjs'

const asyncRandomBytes = promisify(crypto.randomBytes)

export const generateRandomToken = async () => {
  const token = await asyncRandomBytes(32)
  return token.toString('hex')
}

// TODO: Create a middleware that implements this function
export const buildQuery = (json: any) => {
  const query: any = {}
  Object.entries(json).forEach(([k, v]: [string, any]) => {
    switch (k) {
      case 'title':
        query[k] = { $regex: v, $options: 'i' }
        break
      case 'description':
        query[k] = { $regex: v, $options: 'i' }
        break
      case 'createdBy':
      case 'published':
        query[k] = v
        break
      case 'categories':
        query[k] = { $all: v }
        break
      case 'ticketLink':
        query[k] = { $exists: v }
        break
      case 'start':
        query[k] = { ...query.start, $gte: dayjs(v).startOf('D').toDate() }
        break
      case 'end':
        query.start = { ...query.start, $lte: dayjs(v).endOf('D').toDate() }
    }
  })
  return query
}
