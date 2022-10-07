import { Router } from 'express'
import {
  login,
  signup,
  verify,
  resendVerification,
  handleRefreshToken,
  logout
} from '../controllers/auth.controller'
import { signupValidator } from '../validators/auth.validator'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/signup', signupValidator, signup)
authRouter.post('/verify', verify)
authRouter.post('/resend-verification', resendVerification)
authRouter.get('/refresh-token', handleRefreshToken)
authRouter.get('/logout', logout)

export default authRouter
