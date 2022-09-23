import { Request, Response, NextFunction } from 'express'
import { buildFilters } from '../utils/func'

export const filterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let { filters } = req.query as any ?? {}
  if (!filters) {
    filters = { showDeleted: false }
  } else if (!Object.keys(filters).includes('showDeleted')) {
    filters.showDeleted = false
  }
  const newFilters = buildFilters(filters)
  req.filters = newFilters
  return next()
}
