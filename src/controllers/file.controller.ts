import { Request, Response, NextFunction } from 'express'
import multer from 'multer'

const upload = multer({ dest: 'uploads/' })

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {

}
