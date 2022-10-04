import app from '../app'
import db from './db'
import request from 'supertest'
import dotenv from 'dotenv'
import { Verification } from '../models/verification.model'

dotenv.config({ path: '../../.env'})

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
  afterAll(async () =>  await db.closeDatabase())

  it('should not be able to login if not registered', async () => {
    const credentials = Buffer.from('user:password').toString('base64')
    const auth = `Bearer ${credentials}`
    const res = await request(app).post('/auth/login').set('Authorization', auth)
    expect(res.statusCode).toBe(404)
  })

  it('should create new unverified user and send verification email', async () => {
    const res = await request(app).post('/auth/signup').send(userData)
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
    expect(verificationRes.statusCode).toBe(200)
    expect(verificationRes.body.data.verified).toBe(true)
  })

  it('should allow a verified user to log in and return a token', async () => {
    const signupRes = await request(app).post('/auth/signup').send(userData)
    const verification = await Verification.findOne({ email: userData.email }).exec()
    await request(app).post('/auth/verify').send({
      code: verification?.code as string,
      userId: signupRes.body.data._id
    })
    const credentials = Buffer
      .from(`${userData.username}:${userData.password}`)
      .toString('base64')
    const auth = `Bearer ${credentials}`
    const loginRes = await request(app).post('/auth/login').set('Authorization', auth)
    expect(loginRes.statusCode).toBe(200)
    expect(loginRes.body.token).toBeDefined()
  })

})
