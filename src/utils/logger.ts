import pino, { stdSerializers, Options } from 'pino-http'
import { randomUUID } from 'crypto'

const options: Options = {
  enabled: process.env.NODE_ENV !== 'test',
  genReqId: (req, res) => {
    if (req.id) {
      return req.id
    }
    let id = req.get('X-Request-Id')
    if (id) {
      return id
    }
    id = randomUUID()
    res.header('X-Request-Id', id)
    return id
  },
  serializers: {
    err: stdSerializers.err,
    req: stdSerializers.req,
    res: stdSerializers.res
  },
  wrapSerializers: true,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn'
    } else if (res.statusCode >= 500 || err) {
      return 'error'
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent'
    }
    return 'info'
  },
  customSuccessMessage: (req, res) => {
    if (res.statusCode === 404) {
      return 'Resource not found :('
    }
    return `${req.method} completed!`
  },
  customReceivedMessage: (req, res) => {
    return `Incoming ${req.method} request: `
  },
  customErrorMessage: (req, res, err) => {
    return `Request failed with status ${res.statusCode}`
  }
}

export const logger = pino(options)
