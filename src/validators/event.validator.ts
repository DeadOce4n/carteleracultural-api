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
