import { Request, Response, NextFunction } from 'express'
import { buildFilters } from '../utils/func'

export const filterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { filters } = req.query as any
  if (filters) {
    req.filters = buildFilters(filters)
    return next()
  }
  return next()
}
