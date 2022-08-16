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
  console.log('Validation error!')
  console.log(err)
  res.status(418).send({ error: { type: 'ValidationError', body: err.body } })
})
