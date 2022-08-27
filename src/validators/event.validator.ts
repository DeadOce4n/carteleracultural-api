import { BodyValidator, QueryValidator } from 'fastest-express-validator'
import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import {APIError} from '../utils/baseError'
import {HttpStatusCode} from '../utils/enums'

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
  next(err)
}
)

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
  next(err)
}
)

export const queryParamsValidator = QueryValidator({
  filters: {
    type: 'object',
    props: {
      title: { type: 'string', optional: true },
      date: {
        type: 'object',
        props: {
          start: {
            type: 'date',
            optional: false,
            convert: true,
            empty: true
          },
          end: {
            type: 'date',
            optional: true,
            convert: true,
            empty: true
          }
        },
        optional: true
      },
      published: {
        type: 'boolean',
        optional: true,
        convert: true
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
  }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(new APIError(
    'BAD REQUEST',
    HttpStatusCode.BAD_REQUEST,
    true,
    `ValidationError: ${JSON.stringify(err, null, 4)}`
  ))
})
