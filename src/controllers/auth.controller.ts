import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { omit } from 'lodash'
import { User } from '../models/user.model'
import { Verification } from '../models/verification.model'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'
import { generateRandomToken } from '../utils/func'
import { sendMail } from '../utils/mailer'

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
    })

    if (!user) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'User not found'
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

    const secretKey = process.env.SECRET_KEY || 'sacarrácatelas'
    const payload = omit(user.toObject(), 'password')
    const token = jwt.sign(payload, secretKey, {
      expiresIn: '1h',
      audience: 'carteleraculturalens.com',
      issuer: 'api.carteleraculturalens.com'
    })

    return res.send({ token })
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
    })

    if (existingUser) {
      throw new APIError(
        'CONFLICT',
        HttpStatusCode.CONFLICT,
        true,
        'Username or email already in use'
      )
    }

    const newUser = new User({ ...req.body })
    await newUser.save()

    const prevVerification = await Verification.findOne({ email: newUser.email }).lean()
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
    return res.status(200).send(omit(newUser.toObject(), 'password'))
  } catch (e) {
    next(e)
  }
}

export const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, userId } = req.body
    const user = await User.findById(userId)
    if (!user) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'User not found'
      )
    }
    const verification = await Verification.findOne({ email: user.email })
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
    return res.status(200).send(omit(user.toObject(), 'password'))
  } catch (e) {
    next(e)
  }
}

export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id
    const user = await User.findById(userId)
    if (!user) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'User not found'
      )
    }
    const existingVerification = await Verification.findOne({ email: user.email })
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
    return res.status(200)
  } catch (e) {
    next(e)
  }
}
