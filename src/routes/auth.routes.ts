import { Router } from 'express'
import { login, signup, verify } from '../controllers/auth.controller'
import { signupValidator } from '../validators/auth.validator'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/signup', signupValidator, signup)
authRouter.post('/verify', verify)

export default authRouter
