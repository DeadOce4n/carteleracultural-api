import { Schema, model } from 'mongoose'
import { type IEvent } from '../../types/types'

const eventSchema = new Schema<IEvent>({
  title: String,
  description: String,
  flyer: String,
  start: { type: Date, default: Date.now },
  end: { type: Date, required: false },
  ticketLink: { type: String, required: false },
  locationName: { type: String, required: false },
  active: Boolean,
  published: Boolean,
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
})

export const Event = model<IEvent>('Event', eventSchema)
