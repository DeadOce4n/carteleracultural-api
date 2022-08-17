import { BodyValidator } from 'fastest-express-validator'
import { Request, Response, NextFunction } from 'express'

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
  console.log('Validation error!')
  console.log(err)
  res.status(418).send({ error: { type: 'ValidationError', body: err.body } })
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
