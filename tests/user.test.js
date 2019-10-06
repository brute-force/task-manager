const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const { init, me } = require('./fixtures/db');
var expect = require('chai').expect;
const sinon = require('sinon');

describe('user tests', function () {
  before(function () {
    // don't send emails after create/delete
    const fake = sinon.fake();
    sinon.replace(require('@sendgrid/mail'), 'send', fake);
  });

  after(function () {
    sinon.restore();
  });
  beforeEach(init);

  it('create user', async function () {
    const obj = {
      name: 'milo',
      email: 'milo@yahoo.com',
      role: 'usenet downloader',
      password: 'yeshello!!!'
    };

    const response = await request(app)
      .post('/users')
      .send(obj);

    expect(response.statusCode).to.equal(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.to.be.null;

    const { password, ...userCreated } = obj;

    expect(response.body.user).to.include(userCreated);
  });

  it('log in user', async function () {
    const response = await request(app)
      .post('/users/login')
      .send((({ email, password }) => ({ email, password }))(me));

    expect(response.statusCode).to.equal(200);

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).to.equal(user.tokens[1].token);
  });

  it('log in user (unauthorized)', async function () {
    const response = await request(app)
      .post('/users/login')
      .send({ email: 'foo@bar.com', password: 'password' });

    expect(response.statusCode).to.equal(400);
  });

  it('get user', async function () {
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${me.tokens[0].token}`);

    expect(response.statusCode).to.equal(200);
  });

  it('get all users', async function () {
    const response = await request(app)
      .get('/users/all')
      .set('Authorization', `Bearer ${me.tokens[0].token}`);

    expect(response.statusCode).to.equal(200);
    expect(response.body.length).to.equal(2);
  });

  it('get user (unauthorized)', async function () {
    const response = await request(app)
      .get('/users/me');

    expect(response.statusCode).to.equal(401);
  });

  it('delete user', async function () {
    const response = await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${me.tokens[0].token}`);

    expect(response.statusCode).to.equal(200);

    const user = await User.findById(me._id);
    expect(user).to.be.null;
  });

  it('delete user (unauthorized)', async function () {
    const response = await request(app)
      .delete('/users/me');

    expect(response.statusCode).to.equal(401);
  });

  it('upload avatar', async function () {
    const response = await request(app)
      .post('/users/me/avatar')
      .set('Authorization', `Bearer ${me.tokens[0].token}`)
      .attach('avatar', 'tests/fixtures/gingerbread-man.jpg');

    expect(response.statusCode).to.equal(200);

    const user = await User.findById(me._id);
    expect(user.avatar).to.be.instanceof(Buffer);
  });

  it('update user', async function () {
    const nameNew = 'Reuel Alvarez';

    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${me.tokens[0].token}`)
      .send({ name: nameNew })
      .expect(200);

    const user = await User.findById(me._id);
    expect(user.name).to.equal(nameNew);
  });

  it('update user (invalid field)', async function () {
    const response = await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${me.tokens[0].token}`)
      .send({ location: 'New York' });

    expect(response.statusCode).to.equal(400);
  });
});
