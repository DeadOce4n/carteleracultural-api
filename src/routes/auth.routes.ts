import { Router } from 'express'
import {
  login,
  signup,
  verify,
  resendVerification
} from '../controllers/auth.controller'
import { signupValidator } from '../validators/auth.validator'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/signup', signupValidator, signup)
authRouter.post('/verify', verify)
authRouter.post('/resend-verification', resendVerification)

export default authRouter
