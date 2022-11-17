import { roles } from '../utils/constants'
import { Types } from 'mongoose'
import { Response } from 'express'

export type Role = typeof roles[number]

export interface IUser {
  name: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
  role: Role,
  active: boolean,
  verified: boolean,
  registeredAt: Date,
  lastLogin: Date
}

export interface IEvent {
  title: string,
  description: string,
  flyer: string,
  dates: {
    start: Date,
    end?: Date
  }[],
  ticketLink?: string,
  locationName?: string,
  active: boolean,
  published: boolean,
  categories: Array<Types.ObjectId>,
  createdBy: Types.ObjectId
}

export interface ICategory {
  name: string,
  createdAt: Date,
  active: boolean
}

export interface IVerification {
  email: string,
  code: string,
  createdAt: Date,
}

export interface ISession {
  user: Types.ObjectId,
  refreshToken: string
}

type ResponseBody<T> = {
  data: T,
  meta: {
    success: boolean,
    message: string,
    count?: number
  }
}

export type GenericResponse<T> = Response<ResponseBody<T>>
