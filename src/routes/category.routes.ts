import { Router } from 'express'
import {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller'
import { addCategoryValidator, updateCategoryValidator } from '../validators/category.validator'
import { authMiddleware, roleCheckMiddleware } from '../middlewares/auth.middleware'

const categoryRouter = Router()

categoryRouter.get('/', getCategories)
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
