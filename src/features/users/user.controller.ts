import { Request, Response, NextFunction } from 'express'
import { User } from './user.model'
import { APIError } from '../../utils/baseError'
import { HttpStatusCode } from '../../utils/enums'
import { omit } from 'lodash'
import { parseSortOperator } from '../../utils/func'

export const getUsers = async (req: Request, res: Response) => {
  const {
    query: {
      skip,
      limit,
      sort: rawSort
    },
    filters
  } = req as any
  const sort = parseSortOperator(rawSort)
  const options = { skip, limit, sort }
  const users = await User.find(filters, null, options).exec()
  const count = await User.estimatedDocumentCount(filters).exec()

  return res.status(200).send({
    data: users,
    meta: {
      success: true,
      message: 'Fetched users successfully',
      count
    }
  })
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
    return res.status(200).send({
      data: omit(user, 'password'),
      meta: {
        success: true,
        message: 'Fetched user successfully'
      }
    })
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
    return res.status(200).send({
      data: omit(newUser.toObject(), 'password'),
      meta: {
        success: true,
        message: 'Created user successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params
  const userId = req.user?._id
  const userRole = req.user?.role as string

  try {
    if (userRole !== 'super' && _id !== String(userId)) {
      throw new APIError(
        'UNAUTHORIZED',
        HttpStatusCode.UNAUTHORIZED,
        true,
        `User with "${userRole}" role can only update its own data`
      )
    }

    const user = await User.findById(_id).exec()

    if (!user) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'User not found'
      )
    }

    Object.entries(req.body).forEach(([key, value]) => {
      user.set(key, value)
    })

    await user.save()

    return res.status(200).send({
      data: user,
      meta: {
        success: true,
        message: 'Updated user successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params
  try {
    const user = await User.findOneAndUpdate(
      { _id },
      { $set: { active: false } }
    )
    if (!user) {
      throw new APIError(
        'NOT_FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'User does not exist'
      )
    }
    return res.status(200).send({
      data: null,
      meta: {
        success: true,
        message: 'User deleted successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const countUsers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const qty = await User.countDocuments({ active: true })
    return res.status(200).send({
      data: qty,
      meta: {
        success: true,
        message: `Total users: ${qty}`
      }
    })
  } catch (e) {
    next(e)
  }
}
