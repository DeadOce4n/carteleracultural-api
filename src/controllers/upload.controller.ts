import fs from 'fs/promises'
import { Request, Response, NextFunction } from 'express'
import Sharp from 'sharp'

export const imageUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filePath = req.file!.path
    const image = Sharp(filePath)
    const stats = await image.stats()
    const extension = filePath.split('.').at(-1) as string
    const newFilePath = `${filePath.replace('.' + extension, '')}-sq.${extension}`

    await image.resize({
      width: 600,
      height: 600,
      fit: 'contain',
      background: stats.dominant
    }).toFile(newFilePath)

    await fs.unlink(filePath)

    return res.status(200).send({
      data: newFilePath,
      meta: {
        success: true,
        message: 'File uploaded successfully!'
      }
    })
  } catch (e) {
    next(e)
  }
}
