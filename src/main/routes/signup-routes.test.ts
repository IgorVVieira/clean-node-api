import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
  test('should return an account on sucess', async () => {
    const account = {
      name: 'Igor',
      email: 'igor@mail.com',
      password: '12345678',
      passwordConfirmation: '12345678'
    }
    await request(app).post('/api/signup')
      .send(account)
      .expect(200)
  })
})
