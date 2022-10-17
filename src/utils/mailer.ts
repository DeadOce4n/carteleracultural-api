import { createTransport } from 'nodemailer'
import { logger } from '../utils/logger'
import {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  MAIL_SECURE,
  MAIL_SENDER_ADDRESS
} from '../utils/constants'
import { APIError } from './baseError'
import { HttpStatusCode } from './enums'

const transporter = createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_SECURE,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
})

export const sendMail = async (email: string, code: string) => {
  logger.logger.info(`Sending verification email to ${email}`)

  try {
    const info = await transporter.sendMail({
      from: MAIL_SENDER_ADDRESS,
      to: email,
      subject: 'Please verify your account',
      html: `Verification code: ${code}`
    })
    logger.logger.info(`Message sent: ${info.messageId}`)
  } catch (e) {
    if (e instanceof Error) {
      throw new APIError(
        'SERVER_ERROR',
        HttpStatusCode.INTERNAL_SERVER,
        true,
        e.message
      )
    }
  }
}
