import { Request, Response, NextFunction } from 'express'

export const imageUpload = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).send({
    data: req.file?.path ?? '',
    meta: {
      success: true,
      message: 'File uploaded successfully!'
    }
  })
}
