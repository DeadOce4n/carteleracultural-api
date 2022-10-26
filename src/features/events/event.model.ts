import { Schema, model, Types } from 'mongoose'

interface IEvent {
  title: string,
  description: string,
  flyer: string,
  start: Date,
  end?: Date,
  ticketLink?: string,
  locationName?: string,
  active: boolean,
  published: boolean,
  categories: Array<Types.ObjectId>,
  createdBy: Types.ObjectId
}

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
