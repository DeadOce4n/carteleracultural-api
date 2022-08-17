import { BodyValidator } from 'fastest-express-validator'
import { Request, Response, NextFunction } from 'express'
import { roles } from '../models/user.model'

export const addUserValidator = BodyValidator({
  name: { type: 'string' },
  lastName: { type: 'string' },
  username: { type: 'string' },
  email: { type: 'string' },
  password: { type: 'string' },
  role: { type: 'string', enum: roles, default: 'normal' },
  active: { type: 'boolean', default: true },
  verified: { type: 'boolean', default: false },
  registeredAt: { type: 'date', convert: true, default: new Date() },
  lastLogin: { type: 'date', convert: true, optional: true }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(err)
})

export const updateUserValidator = BodyValidator({
  name: {
    type: 'string',
    optional: true
  },
  lastName: {
    type: 'string',
    optional: true
  },
  username: {
    type: 'string',
    optional: true
  },
  email: {
    type: 'string',
    optional: true
  },
  password: {
    type: 'string',
    optional: true
  },
  role: {
    type: 'string',
    enum: roles,
    optional: true
  },
  active: {
    type: 'boolean',
    optional: true
  },
  verified: {
    type: 'boolean',
    optional: true
  },
  registeredAt: {
    type: 'date',
    convert: true,
    optional: true
  },
  lastLogin: {
    type: 'date',
    convert: true,
    optional: true
  }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(err)
})
