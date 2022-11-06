export const roles = ['normal', 'admin', 'super'] as const
export const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
export const JWT_ISSUER = process.env.JWT_ISSUER as string
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE as string
export const MAIL_HOST = process.env.NODE_ENV === 'production'
  ? process.env.MAIL_HOST ?? 'localhost'
  : process.env.TEST_MAIL_HOST ?? 'localhost'
export const MAIL_PORT = process.env.NODE_ENV === 'production'
  ? Number(process.env.MAIL_PORT ?? 25)
  : Number(process.env.TEST_MAIL_PORT ?? 25)
export const MAIL_USER = process.env.NODE_ENV === 'production'
  ? process.env.MAIL_USER ?? 'user'
  : process.env.TEST_MAIL_USER ?? 'user'
export const MAIL_PASS = process.env.NODE_ENV === 'production'
  ? process.env.MAIL_PASS ?? 'pass'
  : process.env.TEST_MAIL_PASS ?? 'pass'
export const MAIL_SENDER_ADDRESS = process.env.MAIL_SENDER_ADDRESS ?? 'verify@carteleraculturalens.com'
export const MAIL_SECURE = process.env.MAIL_SECURE === 'true'
