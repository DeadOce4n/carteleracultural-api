import express, { Express } from 'express'
import mongoose, { ObjectId } from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { loggerMiddleware } from './middlewares/logger.middleware'
import { errorMiddleware } from './middlewares/error.middleware'

import eventRouter from './routes/event.routes'
import categoryRouter from './routes/category.routes'
import userRouter from './routes/user.routes'
import authRouter from './routes/auth.routes'

dotenv.config()

declare global {
  namespace Express {
    interface User {
      _id: ObjectId,
      role: string
    }
  }
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ccultural-prod'
mongoose.connect(MONGO_URI).then(() => {
  const app: Express = express()
  const port = process.env.PORT || 3000

  app.use(cors())
  app.use(express.json())
  app.use(loggerMiddleware)

  app.use('/events', eventRouter)
  app.use('/categories', categoryRouter)
  app.use('/users', userRouter)
  app.use('/auth', authRouter)

  app.use(errorMiddleware)

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
})
