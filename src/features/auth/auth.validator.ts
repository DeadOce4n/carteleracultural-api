import { Request, Response, NextFunction } from 'express'
import { BodyValidator } from 'fastest-express-validator'

export const signupValidator = BodyValidator({
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
    type: 'forbidden',
    remove: true
  },
  active: {
    type: 'forbidden',
    remove: true
  },
  verified: {
    type: 'forbidden',
    remove: true
  }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(err)
})
