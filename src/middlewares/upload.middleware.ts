import multer from 'multer'
import { HttpStatusCode, IMG_MIME_TYPES } from '../utils/enums'
import { APIError } from '../utils/baseError'
import { generateFilename } from '../utils/func'

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    const [extension] = file.originalname.split('.').slice(-1)
    const filename = generateFilename(file.fieldname, extension)
    cb(null, filename)
  }
})

export const imageUpload = multer({
  dest: './public/uploads',
  fileFilter: (req, file, cb) => {
    let error
    if (!IMG_MIME_TYPES.includes(file.mimetype)) {
      error = new APIError(
        'ValidationError',
        HttpStatusCode.BAD_REQUEST,
        true,
        'Wrong filetype!'
      )
    }
    // TODO: make this an env variable
    if (file.size > 1000000) {
      error = new APIError(
        'ValidationError',
        HttpStatusCode.BAD_REQUEST,
        true,
        'File too big!'
      )
    }

    if (error) {
      cb(error)
    } else {
      cb(null, true)
    }
  },
  storage
})
