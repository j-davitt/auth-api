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

describe('v1 Routes', () => {
  it('creates a record', async () => {
    let response = await request.post('/api/v1/food').send({
      name: 'test',
      calories: '100',
      type: 'protein',
    });

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('test');
  });
  it('gets all records', async () => {
    let response = await request.get('/api/v1/food');

    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].name).toEqual('test');
  });
});

