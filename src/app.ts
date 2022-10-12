import express, { Express } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { loggerMiddleware } from './middlewares/logger.middleware'
import { errorMiddleware } from './middlewares/error.middleware'

import eventRouter from './routes/event.routes'
import categoryRouter from './routes/category.routes'
import userRouter from './routes/user.routes'
import authRouter from './routes/auth.routes'
import uploadRouter from './routes/upload.routes'
import path from 'path'
import { logger } from './utils/logger'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ccultural-prod'
const MONGO_DB = process.env.NODE_ENV === 'test'
  ? 'test'
  : process.env.MONGO_DB ?? 'cartelera-cultural'

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO_URI, { dbName: MONGO_DB }).then(() => {
    logger.logger.info(`Mongoose connected on ${MONGO_URI}/${MONGO_DB}`)
  })
}
const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:5173']

const app: Express = express()
const publicPath = path.join(__dirname, '../public')

app.use(cors({
  credentials: true,
  origin: CORS_ORIGINS
}))
app.use(express.json())
app.use(cookieParser())
app.use(loggerMiddleware)
app.use('/public', express.static(publicPath))

app.use('/events', eventRouter)
app.use('/categories', categoryRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/upload', uploadRouter)

app.use(errorMiddleware)

export default app
