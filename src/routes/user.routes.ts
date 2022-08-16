import { Router } from 'express'
import {
  getUsers,
  getUser,
  addUser
} from '../controllers/user.controller'
import { addUserValidator } from '../validators/user.validator'
// import { authMiddleware } from '../middlewares/auth.middleware'

const userRouter = Router()

userRouter.get('/', getUsers)
userRouter.get('/:_id', getUser)
userRouter.post('/', addUserValidator, addUser)

export default userRouter
