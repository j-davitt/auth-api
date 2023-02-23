'use strict';

const { server } = require('../src/server');
const { db, users } = require('../src/models');
const supertest = require('supertest');
const request = supertest(server);

let testAdmin;

beforeAll(async () => {
  await db.sync();
  testAdmin = await users.create({
    username: 'admin',
    password: 'password',
    role: 'admin',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('v2 Routes', () => {
  it('creates a record', async () => {
    let response = await request.post('/api/v2/food').send({
      name: 'test',
      calories: '100',
      type: 'protein',
    }).set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('test');
  });

  it('gets all records', async () => {
    let response = await request.get('/api/v2/food').set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].name).toEqual('test');
  });

  it('updates a record', async () => {
    let response = await request.put('/api/v2/food/1').send({
      name: 'test2',
      calories: '100',
      type: 'protein',
    }).set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('test2');
  });
  
  it('deletes a record', async () => {
    let response = await request.delete('/api/v2/food/1').set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
  });

});

