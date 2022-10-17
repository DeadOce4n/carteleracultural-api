import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { omit } from 'lodash'
import { User } from '../models/user.model'
import { Verification } from '../models/verification.model'
import { Session } from '../models/session.model'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'
import {
  generateRandomToken,
  bakeCookie,
  generateJWT
} from '../utils/func'
import { sendMail } from '../utils/mailer'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../utils/constants'

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      throw new APIError(
        'UNAUTHORIZED',
        HttpStatusCode.UNAUTHORIZED,
        true,
        'Missing credentials.'
      )
    }

    const auth = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8')
    const [username, password] = auth.split(':')
    const user = await User.findOne({
      $or: [
        { username },
        { email: username }
      ]
    }).exec()

    if (!user) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'User not found'
      )
    }

    const session = await Session.findOne({ user: user._id }).exec()

    if (session) {
      throw new APIError(
        'UNAUTHORIZED',
        HttpStatusCode.UNAUTHORIZED,
        true,
        'User is logged in on another device'
      )
    }

    if (!await user.checkPasswordHash(password)) {
      throw new APIError(
        'UNAUTHORIZED',
        HttpStatusCode.UNAUTHORIZED,
        true,
        'Wrong credentials'
      )
    }

    const payload = omit(user.toObject(), 'password')
    const accessToken = generateJWT(payload, '10s', ACCESS_TOKEN_SECRET)
    const refreshToken = generateJWT({ userId: user._id }, '1d', REFRESH_TOKEN_SECRET)
    const newSession = new Session({ user: user._id, refreshToken })

    await newSession.save()

    bakeCookie(refreshToken, res)

    return res.status(200).send({
      data: accessToken,
      meta: {
        success: true,
        message: 'User logged in successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingUser = await User.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username }
      ]
    }).exec()

    if (existingUser) {
      throw new APIError(
        'CONFLICT',
        HttpStatusCode.CONFLICT,
        true,
        'Username or email already in use'
      )
    }

    const newUser = new User({ ...req.body })

    const prevVerification = await Verification.findOne({ email: newUser.email }).exec()
    if (prevVerification) {
      throw new APIError(
        'CONFLICT',
        HttpStatusCode.CONFLICT,
        true,
        'User already registered, please verify account'
      )
    }

    const verification = new Verification({
      email: newUser.email,
      code: await generateRandomToken()
    })

    await sendMail(newUser.email, verification.code)
    await verification.save()
    await newUser.save()
    return res.status(200).send({
      data: omit(newUser.toObject(), 'password'),
      meta: {
        success: true,
        message: 'User registered successfully, verification code sent to email'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, userId } = req.body
    const user = await User.findById(userId).exec()
    if (!user) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'User not found'
      )
    }
    const verification = await Verification.findOne({ email: user.email }).exec()
    if (!verification || code !== verification.code) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.UNPROCESSABLE,
        true,
        'Verification code is not valid'
      )
    }
    user.verified = true
    await user.save()
    await Verification.deleteOne({ _id: verification._id }).exec()

    const payload = omit(user.toObject(), 'password')
    const accessToken = generateJWT(payload, '10s', ACCESS_TOKEN_SECRET)
    const refreshToken = generateJWT({ userId: user._id }, '1d', REFRESH_TOKEN_SECRET)
    const newSession = new Session({ user: user._id, refreshToken })
    await newSession.save()

    bakeCookie(refreshToken, res)

    return res.status(200).send({
      data: accessToken,
      meta: {
        success: true,
        message: 'Verified account successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.body
    const user = await User.findById(_id).exec()
    if (!user) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'User not found'
      )
    }
    const existingVerification = await Verification.findOne({ email: user.email }).exec()
    if (existingVerification) {
      throw new APIError(
        'CONFLICT',
        HttpStatusCode.CONFLICT,
        true,
        'Code already sent to email, please try again later'
      )
    }
    const verification = new Verification({
      email: user.email,
      code: await generateRandomToken()
    })
    await sendMail(user.email, verification.code)
    await verification.save()
    return res.status(200).send({
      data: null,
      meta: {
        success: true,
        message: 'Verification code sent to email'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies

    if (!cookies.jwt) {
      throw new APIError(
        'UNAUTHORIZED',
        HttpStatusCode.UNAUTHORIZED,
        true,
        'A token is required'
      )
    }
    const refreshToken = cookies.jwt
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    })

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload
      const user = await User.findOne({ _id: decoded.userId }).exec()
      if (!user || !user.active) {
        throw new APIError(
          'NOT_FOUND',
          HttpStatusCode.NOT_FOUND,
          true,
          'User not found'
        )
      }
      const session = await Session.findOne({ user: decoded.userId as string }).exec()
      if (!session || session.refreshToken !== refreshToken) {
        if (session) {
          await Session.deleteOne({ _id: session._id })
        }
        throw new APIError(
          'UNAUTHORIZED',
          HttpStatusCode.UNAUTHORIZED,
          true,
          'Hacking attempt will be notified to admins!'
        )
      }
      const newRefreshToken = generateJWT({ userId: user._id }, '1d', REFRESH_TOKEN_SECRET)
      const payload = omit(user.toObject(), 'password')
      const newAccessToken = generateJWT(payload, '10s', ACCESS_TOKEN_SECRET)
      session.refreshToken = newRefreshToken
      await session.save()
      bakeCookie(newRefreshToken, res)

      return res.status(200).send({
        data: newAccessToken,
        meta: {
          success: true,
          message: 'User logged in successfully'
        }
      })
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new APIError(
          'UNAUTHORIZED',
          HttpStatusCode.UNAUTHORIZED,
          true,
          'Refresh token expired!'
        )
      }
      throw e
    }
  } catch (e) {
    next(e)
  }
}

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies
  if (!cookies.jwt) {
    return res.status(200).send({
      data: null,
      meta: {
        success: true,
        message: 'No session to close'
      }
    })
  }
  const refreshToken = cookies.jwt

  const session = await Session
    .findOne({ token: refreshToken })
    .populate('user')
    .exec()

  if (!session) {
    return res.status(200).send({
      data: null,
      meta: {
        success: true,
        message: 'No session to close'
      }
    })
  }

  await Session.deleteOne({ refreshToken })
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
  return res.status(200).send({
    data: null,
    meta: {
      success: true,
      message: 'Session closed succesfully'
    }
  })
}
