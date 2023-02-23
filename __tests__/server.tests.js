'use strict';

const { server } = require('../src/server');
const { db, users } = require('../src/models');
const supertest = require('supertest');
const request = supertest(server);

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
  it('allows user to sign up', async () => {
    let response = await request.post('/signup').send({
      username: 'testAdmin',
      password: 'pass123',
      role: 'admin',
    });

    expect(response.status).toEqual(201);
    expect(response.body.user.username).toEqual('testAdmin');

  });
  it('allows user to sign in', async () => {
    let response = await request.post('/signin').auth('testAdmin', 'pass123');

    expect(response.status).toEqual(200);
    expect(response.body.user.username).toEqual('testAdmin');

  });

  it('allows read access', async () => {
    let response = await request.get('/api/v2/food').set('Authorization', `Bearer ${testWriter.token}`);

    expect(response.status).toEqual(200);

  });


});
