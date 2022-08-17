import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user.model'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'
import { omit } from 'lodash'

export const getUsers = async (_: Request, res: Response) => {
  const users = await User.find()
  return res.status(200).send(users)
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params
    const user = await User.findById(_id).lean()
    if (!user) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'User not found.'
      )
    }
    return res.status(200).send(user)
  } catch (e) {
    next(e)
  }
}

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
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
    return res.status(200).send(omit(newUser.toObject(), 'password'))
  } catch (e) {
    next(e)
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params
  const userId = req.user?._id as string
  const userRole = req.user?.role as string

  try {
    if (userRole !== 'super' && _id !== userId) {
      throw new APIError(
        'UNAUTHORIZED',
        HttpStatusCode.UNAUTHORIZED,
        true,
        `User with "${userRole}" role can only update its own data`
      )
    }

    const user = await User.findOneAndUpdate(
      { _id },
      { $set: { ...req.body } },
      { new: true }
    )

    if (!user) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'User not found'
      )
    }

    return res.status(200).send(user)
  } catch (e) {
    next(e)
  }
}
