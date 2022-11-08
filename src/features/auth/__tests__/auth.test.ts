import app from '../../../app'
import db from '../../../__tests__/db'
import { io } from '../../../server'
import request from 'supertest'
import dotenv from 'dotenv'
import { Verification } from '../verification.model'
import { Session } from '../session.model'
import { User } from '../../users/user.model'

dotenv.config({ path: '../../../../.env' })
jest.setTimeout(40000)

const userData: any = {
  name: 'Pedro',
  lastName: 'Partida',
  username: 'DeadOcean',
  email: process.env.TEST_EMAIL_ADDRESS ?? 'pedro@ivanpartida.xyz',
  password: 'StrongPassword'
}

describe('test authentication', () => {
  beforeAll(async () => await db.connect())
  afterEach(async () => await db.clearDatabase())
  afterAll(async () => {
    await db.closeDatabase()
    io.close()
  })

  it('should not be able to login if not registered', async () => {
    const credentials = Buffer.from('user:password').toString('base64')
    const auth = `Bearer ${credentials}`
    const res = await request(app).post('/auth/login').set('Authorization', auth)
    expect(res.statusCode).toBe(404)
  })

  it('should create new unverified user and send verification email', async () => {
    const res = await request(app).post('/auth/signup').send(userData)
    console.log(JSON.stringify(res, null, 4))
    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeDefined()
    Object.keys(res.body.data).forEach(key => {
      if (Object.keys(userData).includes(key)) {
        expect(res.body.data[key]).toBe(userData[key])
      }
    })
    expect(res.body.data.verified).toBe(false)
  })

  it('should verify a newly registered user succesfully', async () => {
    const signupRes = await request(app).post('/auth/signup').send(userData)
    const verification = await Verification.findOne({ email: userData.email }).exec()
    const verificationRes = await request(app).post('/auth/verify').send({
      code: verification?.code ?? '',
      userId: signupRes.body.data._id
    })
    const user = await User.findOne({ username: userData.username }).exec()
    const session = await Session.findOne({ user: user?._id })
    expect(verificationRes.statusCode).toBe(200)
    expect(verificationRes.body.data).toBeDefined()
    expect(session).toBeDefined()
  })

  it('should delete session when user logs out', async () => {
    const signupRes = await request(app).post('/auth/signup').send(userData)
    const verification = await Verification.findOne({ email: userData.email }).exec()
    const verificationRes = await request(app).post('/auth/verify').send({
      code: verification?.code ?? '',
      userId: signupRes.body.data._id
    })
    const cookie = verificationRes.get('Set-Cookie')
    const logoutRes = await request(app).get('/auth/logout').set('Cookie', cookie)
    const user = await User.findOne({ username: userData.username })
    const session = await Session.findOne({ user: user?._id })
    expect(logoutRes.statusCode).toBe(200)
    expect(logoutRes.body.data).toBeNull()
    expect(session).toBeNull()
  })

  it('should allow a verified user to log in and return a token', async () => {
    const signupRes = await request(app).post('/auth/signup').send(userData)
    const verification = await Verification.findOne({ email: userData.email }).exec()
    const verificationRes = await request(app).post('/auth/verify').send({
      code: verification?.code as string,
      userId: signupRes.body.data._id
    })
    const cookie = verificationRes.get('Set-Cookie')
    await request(app).get('/auth/logout').set('Cookie', cookie)
    const credentials = Buffer
      .from(`${userData.username}:${userData.password}`)
      .toString('base64')
    const auth = `Bearer ${credentials}`
    const loginRes = await request(app).post('/auth/login').set('Authorization', auth)
    expect(loginRes.statusCode).toBe(200)
    expect(loginRes.body.data).toBeDefined()
  })
})
