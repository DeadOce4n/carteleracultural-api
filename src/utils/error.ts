import { BaseError } from './baseError'
import { logger } from './logger'

class ErrorHandler {
  public handleError (err: Error) {
    logger.error('Error message from the centralized error handler:', err)
    if (err.stack) {
      logger.error(err.stack)
    }
  }

  public isTrustedError (err: Error): boolean {
    if (err instanceof BaseError) {
      return err.isOperational
    }
    return false
  }
}

export const errorHandler = new ErrorHandler()
