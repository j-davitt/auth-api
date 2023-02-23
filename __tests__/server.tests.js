'use strict';

const { server } = require('../src/server');
const { db } = require('../src/models');
const supertest = require('supertest');
const request = supertest(server);



beforeAll(async () => {
  await db.sync();
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

});
