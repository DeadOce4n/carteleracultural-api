import { createTransport } from 'nodemailer'
import { logger } from '../utils/logger'

const host = process.env.NODE_ENV === 'test'
  ? process.env.TEST_EMAIL_HOST ?? 'localhost'
  : process.env.MAIL_HOST ?? 'localhost'

const port = process.env.NODE_ENV === 'test'
  ? Number(process.env.TEST_EMAIL_PORT ?? 587)
  : Number(process.env.MAIL_PORT ?? 2525)

const user = process.env.NODE_ENV === 'test'
  ? process.env.TEST_EMAIL_ADDRESS ?? 'user'
  : process.env.MAIL_USER ?? 'user'

const pass = process.env.NODE_ENV === 'test'
  ? process.env.TEST_EMAIL_PASS ?? 'pass'
  : process.env.MAIL_PASS ?? 'pass'

const transporter = createTransport({
  host,
  port,
  secure: process.env.NODE_ENV === 'production',
  auth: {
    user,
    pass
  }
})

export const sendMail = async (email: string, code: string) => {
  logger.logger.info(`Sending verification email to ${email}`)

  const info = await transporter.sendMail({
    from: 'verification@carteleraculturalens.com',
    to: email,
    subject: 'Please verify your account',
    html: `Verification code: ${code}`
  })

  logger.logger.info(`Message sent: ${info.messageId}`)
}
