export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE = 422,
  INTERNAL_SERVER = 500
}

export const IMG_MIME_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/webp'
]
