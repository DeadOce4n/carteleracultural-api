import { createTransport } from 'nodemailer'
import { logger } from '../utils/logger'

const transporter = createTransport({
  host: process.env.MAIL_HOST || 'localhost',
  port: Number(process.env.MAIL_PORT) || 2525,
  secure: false,
  auth: {
    user: process.env.MAIL_USER || 'user',
    pass: process.env.MAIL_PASS || 'pass'
  }
})

export const sendMail = async (email: string, code: string) => {
  logger.info(`Sending verification email to ${email}`)

  const info = await transporter.sendMail({
    from: 'verification@carteleraculturalens.com',
    to: email,
    subject: 'Please verify your account',
    html: `Verification code: ${code}`
  })

  logger.info(`Message sent: ${info.messageId}`)
}
