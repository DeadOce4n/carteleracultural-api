import { Request, Response, NextFunction } from 'express'
import { BodyValidator } from 'fastest-express-validator'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'

export const loginValidator = BodyValidator({
  username: { type: 'string' },
  password: { type: 'string' }
}, (err, req: Request, res: Response, next: NextFunction) => {
  next(new APIError('ValidationError', HttpStatusCode.BAD_REQUEST, true, err?.body?.map((e) => e.message).join(', ')))
})
