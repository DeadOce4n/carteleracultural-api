import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import jwt from 'jsonwebtoken'
import { User, Role } from '../features/users/user.model'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'
import { ACCESS_TOKEN_SECRET } from '../utils/constants'

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ACCESS_TOKEN_SECRET,
  issuer: 'api.carteleraculturalens.com',
  audience: 'carteleraculturalens.com',
  ignoreExpiration: true,
  passReqToCallback: true
}

passport.use(new JwtStrategy(options, async (req: any, jwtPayload: any, done: any) => {
  const user = await User.findById(jwtPayload._id)
  if (!user) {
    return done(new APIError(
      'UNAUTHORIZED',
      HttpStatusCode.UNAUTHORIZED,
      true,
      'User not found'
    ), false)
  }
  if (!user.verified) {
    return done(new APIError(
      'UNAUTHORIZED',
      HttpStatusCode.UNAUTHORIZED,
      true,
      'User not verified'
    ), false)
  }
  try {
    const token = req.headers.authorization?.split(' ')[1] as string
    const { issuer, audience } = options
    jwt.verify(token, options.secretOrKey as string, { issuer, audience })
  } catch (e) {
    return done(new APIError(
      'UNAUTHORIZED',
      HttpStatusCode.UNAUTHORIZED,
      true,
      'Token has expired!'
    ), false)
  }
  return done(null, user)
}))

export const authMiddleware = passport.authenticate('jwt', {
  session: false,
  failWithError: true
})

export const roleCheckMiddleware = (roles: Role[]) => {
  const roleCheck = (req: Request, res: Response, next: NextFunction) => {
    const userRole: Role = req.user?.role as Role || 'normal'
    if (!roles.includes(userRole)) {
      throw new APIError(
        'UNAUTHORIZED',
        HttpStatusCode.UNAUTHORIZED,
        true,
        'User has insufficient permissions'
      )
    }
    next()
  }
  return roleCheck
}
