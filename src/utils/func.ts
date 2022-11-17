import crypto from 'crypto'
import { promisify } from 'util'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'
import type { Response } from 'express'
import {
  COOKIE_MAX_AGE,
  JWT_ISSUER,
  JWT_AUDIENCE
} from './constants'

const asyncRandomBytes = promisify(crypto.randomBytes)

export const generateRandomToken = async () => {
  const token = await asyncRandomBytes(4)
  return token.toString('hex')
}

export const buildFilters = (json: any) => {
  const query: any = {}
  if (json) {
    Object.entries(json).forEach(([k, v]: [string, any]) => {
      switch (k) {
        case 'title':
        case 'name':
        case 'description':
        case 'username':
        case 'lastName':
        case 'email':
          query[k] = { $regex: v, $options: 'i' }
          break
        case 'createdBy':
          query[k] = v
          break
        case 'verified':
        case 'published':
          if (typeof v === 'boolean') {
            query[k] = v
          }
          break
        case 'categories':
          query[k] = { $all: v }
          break
        case 'ticketLink':
          if (v !== 'all') {
            query[k] = { $exists: v }
          }
          break
        case 'start':
          query['dates.0.start'] = { ...query['dates.0.start'], $gte: dayjs(v.lower).startOf('D').toDate() }
          if (Object.keys(v).includes('upper')) {
            query['dates.0.start'] = { ...query['dates.0.start'], $lte: dayjs(v.upper).endOf('D').toDate() }
          } else {
            query['dates.0.start'] = { ...query['dates.0.start'], $lte: dayjs(v.lower).endOf('D').toDate() }
          }
          break
        case 'showDeleted':
          if (!v) {
            query.active = true
          }
          break
        case 'role':
          query[k] = { $in: v }
      }
    })
  }
  return query
}

export const generateFilename = (name: string, extension: string) => {
  const suffix = crypto.randomBytes(8).toString('hex')
  return `${name}-${suffix}.${extension}`
}

export const parseSortOperator = (operator: string) => {
  let criteria
  let field
  if (operator.startsWith('-')) {
    criteria = -1
    field = operator.substring(1)
  } else {
    criteria = 1
    field = operator
  }
  switch (field) {
    case 'start':
      field = 'dates.0.start'
      break
  }
  const query = {
    [field]: criteria
  }
  return query
}

export const bakeCookie = (token: string, res: Response) => res.cookie(
  'jwt',
  token,
  {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: COOKIE_MAX_AGE
  }
)

export const generateJWT = (payload: any, expiration: string, secret: string) => jwt.sign(
  payload,
  secret,
  {
    expiresIn: expiration,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  }
)
