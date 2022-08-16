import { Request, Response, NextFunction } from 'express'
import { BaseError } from '../utils/baseError'
import { errorHandler } from '../utils/error'
import { HttpStatusCode } from '../utils/enums'

export const errorMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handleError(err)
  if (errorHandler.isTrustedError(err)) {
    const error = err as BaseError
    return res.status(error.httpCode).send({ error: error.name, message: error.message })
  }
  return res.status(HttpStatusCode.INTERNAL_SERVER).send({
    error: 'INTERNAL SERVER ERROR',
    message: `${err}`
  })
}
