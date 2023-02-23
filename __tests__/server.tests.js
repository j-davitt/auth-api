'use strict';

const { app } = require('../src/server');
const { db, users } = require('../src/models');
const supertest = require('supertest');
const request = supertest(app);

let testWriter;

beforeAll(async () => {
  await db.sync();
  testWriter = await users.create({
    username: 'testWriter',
    password: 'pass123',
    role: 'writer',
  });
});

afterAll(async () => {
  await db.drop();
});


describe('Server tests', () => {
  it('allows read access', async () => {
    let response = await request.get('/api/v2/food').set('Authorization', `Bearer ${testWriter.token}`);

    expect(response.status).toEqual(200);

  });

  it('allows create access', async () => {
    let response = await request.post('/create').set('Authorization', `Bearer ${testWriter.token}`);

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('You have create permission');
  });


});
