import { BodyValidator } from 'fastest-express-validator'
import { Request, Response, NextFunction } from 'express'

export const addCategoryValidator = BodyValidator({
  name: { type: 'string' },
  active: { type: 'boolean', default: true }
}, (err, req: Request, res: Response, next: NextFunction) => {
  console.log('Validation error!')
  console.log(err)
  res.status(418).send({ error: { type: 'ValidationError', body: err.body } })
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
  next(err)
})
