import { Router } from 'express'
import { login, signup, verify } from '../controllers/auth.controller'
import { addUserValidator } from '../validators/user.validator'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/signup', addUserValidator, signup)
authRouter.post('/verify', verify)

export default authRouter
