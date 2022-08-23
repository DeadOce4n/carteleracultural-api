import { Request, Response, NextFunction } from 'express'
import { Category } from '../models/category.model'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'

export const getCategories = async (_: Request, res: Response) => {
  const categories = await Category.find()
  return res.status(200).send({
    data: categories,
    meta: {
      success: true,
      message: 'Fetched categories successfully'
    }
  })
}

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params
    const category = await Category.findById(_id)
    if (!category) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'Category not found'
      )
    }
    return res.status(200).send({
      data: category,
      meta: {
        success: true,
        message: 'Fetched category successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body
  try {
    const category = await Category.findOne({ name })
    if (category) {
      throw new APIError(
        'CONFLICT',
        HttpStatusCode.CONFLICT,
        true,
        `Category "${name}" already exists`
      )
    }
    const newCategory = new Category({ ...req.body })
    await newCategory.save()
    return res.status(200).send({
      data: newCategory,
      meta: {
        success: true,
        message: 'Created category successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params
  try {
    const category = await Category.findOneAndUpdate(
      { _id },
      { $set: { ...req.body } },
      { new: true }
    )
    if (!category) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'Category not found'
      )
    }
    return res.status(200).send({
      data: category,
      meta: {
        success: true,
        message: 'Updated category successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}
