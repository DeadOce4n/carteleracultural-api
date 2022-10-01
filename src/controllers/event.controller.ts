import { Request, Response, NextFunction } from 'express'
import { Event } from '../models/event.model'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'
import { parseSortOperator } from '../utils/func'

export const getEvents = async (req: Request, res: Response) => {
  const {
    query: {
      skip,
      limit,
      sort: rawSort
    },
    filters
  } = req as any
  const sort = parseSortOperator(rawSort)
  const options = { skip, limit, sort }
  const events = await Event.find(filters, null, options).exec()
  const count = await Event.estimatedDocumentCount(filters).exec()

  return res.status(200).send({
    data: events,
    meta: {
      success: true,
      message: 'Fetched events successfully',
      count
    }
  })
}

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params
  try {
    const event = await Event
      .findById(_id)
      .populate('categories')
      .populate('createdBy')
      .exec()
    if (!event) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'Event not found'
      )
    }
    return res.status(200).send({
      data: event,
      meta: {
        success: true,
        message: 'Fetched event successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const addEvent = async (req: Request, res: Response, next: NextFunction) => {
  const newEvent = new Event({ ...req.body, createdBy: req.user?._id })
  try {
    await newEvent.save()
    return res.status(200).send({
      data: newEvent,
      meta: {
        success: true,
        message: 'Created event successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params
  const userId = req.user?._id
  const userRole = req.user?.role as string

  try {
    const event = await Event.findById(_id).exec()

    if (!event) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'Event not found'
      )
    }

    if (!['admin', 'super'].includes(userRole) && String(event.createdBy) !== String(userId)) {
      throw new APIError(
        'UNAUTHORIZED',
        HttpStatusCode.UNAUTHORIZED,
        true,
        `User with "${userRole}" role can only update its own events`
      )
    }

    const updatedEvent = await Event
      .findOneAndUpdate(
        { _id },
        { $set: { ...req.body } },
        { new: true }
      )
      .populate('categories')
      .populate('createdBy')
      .exec()

    return res.status(200).send({
      data: updatedEvent,
      meta: {
        success: true,
        message: 'Updated event successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params
  try {
    const event = await Event.findOneAndUpdate(
      { _id },
      { $set: { active: false } }
    ).exec()
    if (!event) {
      throw new APIError(
        'NOT_FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'Event does not exist'
      )
    }
    return res.status(200).send({
      data: null,
      meta: {
        success: true,
        message: 'Event deleted successfully'
      }
    })
  } catch (e) {
    next(e)
  }
}

export const countEvents = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const qty = await Event.countDocuments({ active: true })
    return res.status(200).send({
      data: qty,
      meta: {
        success: true,
        message: `Total events: ${qty}`
      }
    })
  } catch (e) {
    next(e)
  }
}
