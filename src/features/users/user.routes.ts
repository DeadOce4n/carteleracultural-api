import { Router } from 'express'
import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  countUsers
} from './user.controller'
import {
  addUserValidator,
  updateUserValidator,
  queryParamsValidator
} from './user.validator'
import { authMiddleware, roleCheckMiddleware } from '../../middlewares/auth.middleware'
import { filterMiddleware } from '../../middlewares/filters.middleware'

const userRouter = Router()

userRouter.get('/', queryParamsValidator, filterMiddleware, getUsers)
userRouter.get('/count', countUsers)
userRouter.get('/:_id', getUser)
userRouter.post(
  '/',
  authMiddleware,
  roleCheckMiddleware(['admin', 'super']),
  addUserValidator,
  addUser
)
userRouter.put(
  '/:_id',
  authMiddleware,
  roleCheckMiddleware(['normal', 'admin', 'super']),
  updateUserValidator,
  updateUser
)
userRouter.delete(
  '/:_id',
  authMiddleware,
  roleCheckMiddleware(['super']),
  deleteUser
)

export default userRouter
