import { Router } from 'express'
import {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  countCategories
} from './category.controller'
import {
  addCategoryValidator,
  updateCategoryValidator,
  queryParamsValidator
} from './category.validator'
import { authMiddleware, roleCheckMiddleware } from '../../middlewares/auth.middleware'
import { filterMiddleware } from '../../middlewares/filters.middleware'

const categoryRouter = Router()

categoryRouter.get(
  '/',
  queryParamsValidator,
  filterMiddleware,
  getCategories
)
categoryRouter.get('/count', countCategories)
categoryRouter.get('/:_id', getCategory)
categoryRouter.post(
  '/',
  authMiddleware,
  roleCheckMiddleware(['admin', 'super']),
  addCategoryValidator,
  addCategory
)
categoryRouter.put(
  '/:_id',
  authMiddleware,
  roleCheckMiddleware(['admin', 'super']),
  updateCategoryValidator,
  updateCategory
)
categoryRouter.delete(
  '/:_id',
  authMiddleware,
  roleCheckMiddleware(['admin', 'super']),
  deleteCategory
)

export default categoryRouter
