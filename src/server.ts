import app from './app'
import { logger } from './utils/logger'
import http from 'http'
import { Server } from 'socket.io'

const port = Number(process.env.PORT ?? 3000)
const server = http.createServer(app).listen(port, () => {
  logger.logger.info(`Server is running at http://localhost:${port}`)
})
export const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:5173']
  }
})
io.on('connection', socket => {
  logger.logger.info('Connected!', socket.id)
})
