import { Schema, model } from 'mongoose'

interface ICategory {
  name: string,
  createdAt: Date,
  active: boolean
}

const categorySchema = new Schema<ICategory>({
  name: String,
  createdAt: { type: Date, default: Date.now },
  active: Boolean
})

export const Category = model<ICategory>('Category', categorySchema)
