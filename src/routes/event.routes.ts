import { Router } from 'express'
import {
  getEvents,
  getEvent,
  addEvent
} from '../controllers/event.controller'
import { addEventValidator } from '../validators/event.validator'
import { authMiddleware, roleCheckMiddleware } from '../middlewares/auth.middleware'

const eventRouter = Router()

eventRouter.get('/', getEvents)
eventRouter.get('/:_id', getEvent)
eventRouter.post(
  '/',
  authMiddleware,
  roleCheckMiddleware(['admin', 'super']),
  addEventValidator,
  addEvent
)

export default eventRouter
