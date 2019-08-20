const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const { init, me } = require('./fixtures/db')

beforeEach(init);

test('create user', async () => { 
    const obj = {
        name: 'milo',
        email: 'milo@yahoo.com',
        password: 'yeshello!!!'
    };

    const response = await request(app)
        .post('/users')
        .send(obj)
        .expect(201);

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull();

    const {password, ...userCreated} = obj;
    expect(response.body.user).toMatchObject(userCreated);
});

test('log in user', async () => { 
    const response = await request(app)
        .post('/users/login')
        .send((({ email, password }) => ({ email, password }))(me))
        .expect(200);

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('log in invalid user', async () => { 
    await request(app)
        .post('/users/login')
        .send({ email: 'foo@bar.com', password: 'password'})
        .expect(400);
});

test('get user; unauthenticated', async () => {
    await request(app)
        .get('/users/me')
        .expect(401);
});

test('get user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${me.tokens[0].token}`)
        .expect(200);
});

test('delete user; unauthenticated', async () => {
    await request(app)
        .delete('/users/me')
        .expect(401);
});

test('delete user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${me.tokens[0].token}`)
        .expect(200);
    
    const user = await User.findById(me._id);
    
    expect(user).toBeNull();
});

test('upload avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${me.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/gingerbread-man.jpg')
        .expect(200);

    const user = await User.findById(me._id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('update user', async () => {
    const nameNew = 'reuel alvarez';

    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${me.tokens[0].token}`)
        .send({ name: nameNew })
        .expect(200);

    const user = await User.findById(me._id);
    expect(user.name).toEqual(nameNew);
});

test('update user; invalid field', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${me.tokens[0].token}`)
        .send({ location: 'New York' })
        .expect(400);
});
