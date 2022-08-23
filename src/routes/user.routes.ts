import { Router } from 'express'
import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller'
import { addUserValidator, updateUserValidator } from '../validators/user.validator'
import { authMiddleware, roleCheckMiddleware } from '../middlewares/auth.middleware'

const userRouter = Router()

userRouter.get('/', getUsers)
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
