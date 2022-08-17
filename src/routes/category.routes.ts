import { Router } from 'express'
import {
  getCategories,
  getCategory,
  addCategory
} from '../controllers/category.controller'
import { addCategoryValidator } from '../validators/category.validator'
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

export default categoryRouter
