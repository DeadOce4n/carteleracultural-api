import { createTransport } from 'nodemailer'
import { logger } from '../utils/logger'

const host = process.env.MAIL_HOST ?? 'localhost'
const port = Number(process.env.MAIL_PORT ?? 2525)
const user = process.env.MAIL_USER ?? 'user'
const pass = process.env.MAIL_PASS ?? 'pass'

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
