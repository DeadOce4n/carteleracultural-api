import { BodyValidator, QueryValidator } from 'fastest-express-validator'
import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'

const { ObjectId: ObjectID } = Types

export const addEventValidator = BodyValidator({
  title: {
    type: 'string'
  },
  description: {
    type: 'string'
  },
  flyer: {
    type: 'string'
  },
  start: {
    type: 'date',
    convert: true
  },
  end: {
    type: 'date',
    optional: true,
    convert: true
  },
  ticketLink: {
    type: 'string',
    optional: true
  },
  locationName: {
    type: 'string',
    optional: true
  },
  active: {
    type: 'boolean',
    default: true
  },
  published: {
    type: 'boolean',
    default: false
  },
  categories: {
    type: 'array',
    items: 'string',
    default: []
  }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(new APIError(
    'BAD REQUEST',
    HttpStatusCode.BAD_REQUEST,
    true,
    `ValidationError: ${JSON.stringify(err, null, 4)}`
  ))
})

export const updateEventValidator = BodyValidator({
  title: {
    type: 'string',
    optional: true
  },
  description: {
    type: 'string',
    optional: true
  },
  flyer: {
    type: 'string',
    optional: true
  },
  start: {
    type: 'date',
    optional: true,
    convert: true
  },
  end: {
    type: 'date',
    optional: true,
    convert: true
  },
  ticketLink: {
    type: 'string',
    optional: true
  },
  locationName: {
    type: 'string',
    optional: true
  },
  active: {
    type: 'boolean',
    optional: true
  },
  published: {
    type: 'boolean',
    optional: true
  },
  categories: {
    type: 'array',
    items: 'string',
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
      title: { type: 'string', optional: true },
      start: {
        type: 'object',
        props: {
          lower: {
            type: 'date',
            convert: true
          },
          upper: {
            type: 'date',
            convert: true,
            optional: true
          }
        },
        optional: true
      },
      end: {
        type: 'object',
        props: {
          lower: {
            type: 'date',
            convert: true
          },
          upper: {
            type: 'date',
            convert: true,
            optional: true
          }
        },
        optional: true
      },
      published: {
        type: 'enum',
        values: [true, false, 'all'],
        optional: true,
        convert: true
      },
      active: {
        type: 'enum',
        values: [true, false, 'all'],
        optional: true,
        convert: true
      },
      ticketLink: {
        type: 'boolean',
        optional: true,
        convert: true
      },
      createdBy: {
        type: 'objectID',
        ObjectID,
        convert: true,
        optional: true
      },
      categories: {
        type: 'array',
        items: {
          type: 'objectID',
          ObjectID
        },
        optional: true
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
    default: '-start'
  }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(new APIError(
    'BAD REQUEST',
    HttpStatusCode.BAD_REQUEST,
    true,
    `ValidationError: ${JSON.stringify(err, null, 4)}`
  ))
})
