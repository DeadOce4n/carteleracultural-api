import { Schema, model } from 'mongoose'
import { ICategory } from '../../types/types'

const categorySchema = new Schema<ICategory>({
  name: String,
  createdAt: { type: Date, default: Date.now },
  active: Boolean
})

export const Category = model<ICategory>('Category', categorySchema)
