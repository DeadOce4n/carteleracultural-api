import { Request, Response, NextFunction } from 'express'
import { Event } from '../models/event.model'
import { APIError } from '../utils/baseError'
import { HttpStatusCode } from '../utils/enums'

export const getEvents = async (req: Request, res: Response) => {
  const events = await Event.find().populate('categories')
  return res.status(200).send(events)
}

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params
  try {
    const event = await Event.findById(_id).populate('categories')
    if (!event) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'Event not found'
      )
    }
    return res.status(200).send(event)
  } catch (e) {
    next(e)
  }
}

export const addEvent = async (req: Request, res: Response, next: NextFunction) => {
  const newEvent = new Event({ ...req.body, createdBy: req.user?._id })
  try {
    await newEvent.save()
    return res.status(200).send(newEvent)
  } catch (e) {
    next(e)
  }
}

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params
  try {
    const event = await Event.findOneAndUpdate(
      { _id },
      { $set: { ...req.body } },
      { new: true }
    )
    if (!event) {
      throw new APIError(
        'NOT FOUND',
        HttpStatusCode.NOT_FOUND,
        true,
        'Event not found'
      )
    }
    return res.status(200).send(event)
  } catch (e) {
    next(e)
  }
}
