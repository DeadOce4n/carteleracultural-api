import { Router } from 'express'
import {
  getEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
  countEvents
} from '../controllers/event.controller'
import {
  addEventValidator,
  updateEventValidator,
  queryParamsValidator
} from '../validators/event.validator'
import { authMiddleware, roleCheckMiddleware } from '../middlewares/auth.middleware'
import { filterMiddleware } from '../middlewares/filters.middleware'

const eventRouter = Router()

eventRouter.get('/count', countEvents)
eventRouter.get('/', queryParamsValidator, filterMiddleware, getEvents)
eventRouter.get('/:_id', getEvent)
eventRouter.post(
  '/',
  authMiddleware,
  roleCheckMiddleware(['admin', 'super']),
  addEventValidator,
  addEvent
)
eventRouter.put(
  '/:_id',
  authMiddleware,
  roleCheckMiddleware(['normal', 'admin', 'super']),
  updateEventValidator,
  updateEvent
)
eventRouter.delete(
  '/:_id',
  authMiddleware,
  roleCheckMiddleware(['normal', 'admin', 'super']),
  deleteEvent
)

export default eventRouter
