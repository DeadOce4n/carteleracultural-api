import { Request, Response, NextFunction } from 'express'
import { Event } from '../models/event.model'

export const getEvents = async (req: Request, res: Response) => {
  const events = await Event.find().populate('categories')
  return res.status(200).send(events)
}

export const getEvent = async (req: Request, res: Response) => {
  const { _id } = req.params
  const event = await Event.findById(_id).populate('categories')
  if (!event) return res.status(404).send({ error: 'Event not found.' })
  return res.status(200).send(event)
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
  const event = await Event.findById(_id)
  if (!event) {
    return res.status(404).send({
      error: {
        type: 'Entity not found',
        body: 'Event not found.'
      }
    })
  }
  try {
    await event.updateOne({ _id }, { ...req.body })
  } catch (e) {
    next(e)
  }
}
