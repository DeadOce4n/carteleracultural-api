import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import { User } from '../models/user.model'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY || 'sacarrácatelas',
  issuer: 'api.carteleraculturalens.com',
  audience: 'carteleraculturalens.com'
}

passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
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
  return done(null, user)
}))

export const authMiddleware = passport.authenticate('jwt', {
  session: false,
  failWithError: true
})
