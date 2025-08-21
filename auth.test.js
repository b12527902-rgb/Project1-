const request = require('supertest');
const { app } = require('../src/server');

describe('Authentication Endpoints', () => {
  let testEmail = `testuser_${Date.now()}@example.com`;
  let testPassword = 'TestPass123!';
  let userId;

  it('POST /api/auth/register should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: testPassword, fullName: 'Test User' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user.email', testEmail);
    userId = res.body.user.id;
  });

  it('POST /api/auth/login should login the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/reset-password should accept a valid email', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: testEmail });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/auth/reset-password should not reveal if email does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'nonexistent_' + Date.now() + '@example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  // Note: /reset-password/confirm requires a valid token, which is hard to automate in a unit test without mocking DB/email.
}); 