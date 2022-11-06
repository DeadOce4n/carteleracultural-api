import { Request, NextFunction } from 'express'
import { Category } from './category.model'
import { APIError } from '../../utils/baseError'
import { HttpStatusCode } from '../../utils/enums'
import { parseSortOperator } from '../../utils/func'
import { type GenericResponse, type ICategory } from '../../types/types'

export const getCategories = async (
  req: Request,
  res: GenericResponse<ICategory[]>
) => {
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
  const categories = await Category.find(filters, null, options).exec()
  const count = await Category.estimatedDocumentCount(filters).exec()

  return res.status(200).send({
    data: categories,
    meta: {
      success: true,
      message: 'Fetched categories successfully',
      count
    }
  })
}

export const getCategory = async (
  req: Request,
  res: GenericResponse<ICategory>,
  next: NextFunction
) => {
  const { _id } = req.params
  try {
    const category = await Category.findById(_id).exec()
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

export const addCategory = async (
  req: Request,
  res: GenericResponse<ICategory>,
  next: NextFunction
) => {
  const { name } = req.body
  try {
    const category = await Category.findOne({ name }).exec()
    if (category) {
      if (category.active) {
        throw new APIError(
          'CONFLICT',
          HttpStatusCode.CONFLICT,
          true,
          `Category "${name}" already exists`
        )
      } else {
        category.active = true
        await category.save()
        return res.status(200).send({
          data: category,
          meta: {
            success: true,
            message: 'Re-activated category successfully'
          }
        })
      }
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

export const updateCategory = async (
  req: Request,
  res: GenericResponse<ICategory>,
  next: NextFunction
) => {
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

export const deleteCategory = async (
  req: Request,
  res: GenericResponse<null>,
  next: NextFunction
) => {
  const { _id } = req.params
  try {
    const category = await Category.findOneAndUpdate(
      { _id },
      { $set: { active: false } }
    )
    if (!category) {
      throw new APIError(
        'NOT_FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'Category does not exist'
      )
    }
    return res.status(200).send({
      data: null,
      meta: {
        success: true,
        message: 'Category deleted successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const countCategories = async (
  _: Request,
  res: GenericResponse<number>,
  next: NextFunction
) => {
  try {
    const qty = await Category.countDocuments({ active: true })
    return res.status(200).send({
      data: qty,
      meta: {
        success: true,
        message: `Total categories: ${qty}`
      }
    })
  } catch (e) {
    next(e)
  }
}
