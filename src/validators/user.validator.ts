import { BodyValidator, QueryValidator } from 'fastest-express-validator'
import { Request, Response, NextFunction } from 'express'
import { roles } from '../models/user.model'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'

export const addUserValidator = BodyValidator({
  name: {
    type: 'string'
  },
  lastName: {
    type: 'string'
  },
  username: {
    type: 'string'
  },
  email: {
    type: 'string'
  },
  password: {
    type: 'string'
  },
  role: {
    type: 'string',
    enum: roles,
    default: 'normal'
  },
  active: {
    type: 'boolean',
    default: true
  },
  verified: {
    type: 'boolean',
    default: false
  },
  registeredAt: {
    type: 'date',
    convert: true,
    default: new Date()
  },
  lastLogin: {
    type: 'date',
    convert: true,
    optional: true
  }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(new APIError(
    'BAD REQUEST',
    HttpStatusCode.BAD_REQUEST,
    true,
    `ValidationError: ${JSON.stringify(err, null, 4)}`
  ))
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
  next(new APIError(
    'BAD REQUEST',
    HttpStatusCode.BAD_REQUEST,
    true,
    `ValidationError: ${JSON.stringify(err, null, 4)}`
  ))
})

export const queryParamsValidator = QueryValidator({
  filters: {
    type: 'object',
    props: {
      username: 'string|optional',
      name: 'string|optional',
      lastName: 'string|optional',
      email: 'string|optional',
      showDeleted: {
        type: 'boolean',
        default: false,
        convert: true
      },
      role: {
        type: 'array',
        items: 'string',
        enum: ['normal', 'admin', 'super'],
        optional: true
      },
      verified: {
        type: 'enum',
        values: [true, false, 'all'],
        optional: true,
        convert: true
      },
      registeredAt: {
        type: 'date',
        convert: true,
        optional: true
      }
    },
    optional: true
  }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(new APIError(
    'BAD REQUEST',
    HttpStatusCode.BAD_REQUEST,
    true,
    `ValidationError: ${JSON.stringify(err, null, 4)}`
  ))
})
