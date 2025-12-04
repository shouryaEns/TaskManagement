const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
describe('Auth', () => {
  afterAll(()=> mongoose.connection.close());
  test('register and login', async () => {
    const email = `test${Date.now()}@ex.com`;
    const res = await request(app).post('/api/auth/register').send({ name:'t', email, password:'Pass123!' });
    expect(res.statusCode).toBe(201);
    const login = await request(app).post('/api/auth/login').send({ email, password: 'Pass123!' });
    expect(login.body.token).toBeDefined();
  });
});
