import { Router } from 'express'
import { imageUpload } from './upload.controller'
import { imageUpload as imageUploadMiddleware } from '../../middlewares/upload.middleware'
import { authMiddleware } from '../../middlewares/auth.middleware'

const uploadRouter = Router()

uploadRouter.post(
  '/image',
  authMiddleware,
  imageUploadMiddleware.single('image'),
  imageUpload
)

export default uploadRouter
