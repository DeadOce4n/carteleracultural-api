import { BodyValidator, QueryValidator } from 'fastest-express-validator'
import { Request, Response, NextFunction } from 'express'
import { APIError } from '../../utils/baseError'
import { HttpStatusCode } from '../../utils/enums'

export const addCategoryValidator = BodyValidator({
  name: {
    type: 'string'
  },
  active: {
    type: 'boolean',
    default: true
  }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(new APIError(
    'BAD REQUEST',
    HttpStatusCode.BAD_REQUEST,
    true,
    `ValidationError: ${JSON.stringify(err, null, 4)}`
  ))
})

export const updateCategoryValidator = BodyValidator({
  name: {
    type: 'string',
    optional: true
  },
  active: {
    type: 'boolean',
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
      name: 'string|optional',
      showDeleted: {
        type: 'boolean',
        default: false,
        convert: true
      }
    },
    optional: true
  },
  skip: {
    type: 'number',
    convert: true,
    default: 0
  },
  limit: {
    type: 'number',
    convert: true,
    default: 20
  },
  sort: {
    type: 'string',
    pattern: /^-|[a-z]*/,
    default: 'name'
  }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(new APIError(
    'BAD REQUEST',
    HttpStatusCode.BAD_REQUEST,
    true,
    `ValidationError: ${JSON.stringify(err, null, 4)}`
  ))
})
