import { Request, Response, NextFunction } from 'express'
import { BaseError } from '../utils/baseError'
import { errorHandler } from '../utils/error'
import { HttpStatusCode } from '../utils/enums'

export const errorMiddleware = async (err: Error & BaseError, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handleError(err)
  if (errorHandler.isTrustedError(err)) {
    return res.status(err.httpCode).send({ error: err.name, message: err.message })
  }
  return res.status(HttpStatusCode.INTERNAL_SERVER).send({
    error: 'INTERNAL SERVER ERROR',
    message: `${err}`
  })
}
