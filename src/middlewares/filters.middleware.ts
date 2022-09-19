import { Request, Response, NextFunction } from 'express'
import { buildFilters } from '../utils/func'

export const filterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let { filters } = req.query as any ?? {}
  if (!filters) {
    filters = { active: true }
  } else if (!Object.keys(filters).includes('active')) {
    filters.active = true
  }
  const newFilters = buildFilters(filters)
  req.filters = newFilters
  return next()
}
