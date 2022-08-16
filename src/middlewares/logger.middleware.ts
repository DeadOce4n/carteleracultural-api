import morgan from 'morgan'
import { logger } from '../utils/logger'

const stream = {
  write: (message: string) => logger.http(message)
}

const skip = () => {
  const env = process.env.NODE_ENV || 'development'
  return env !== 'development'
}

export const loggerMiddleware = morgan('tiny', { stream, skip })
