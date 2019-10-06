const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');
const { init, me, tasks } = require('./fixtures/db');

var expect = require('chai').expect;

const myTask = {
  title: 'read some books',
  description: 'all of them',
  dateDue: new Date().toISOString(),
  isCompleted: true
};

describe('task tests', function (done) {
  beforeEach(init);

  it('create task', async function () {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${me.tokens[0].token}`)
      .send({ ...myTask, owner: me._id });

    expect(response.statusCode).to.equal(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.to.be.null;

    // expect(response.body).toMatchObject(myTask);
    expect(response.body).to.include(myTask);
  });

  it('get tasks', async function () {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${me.tokens[0].token}`)
      .send()
      .expect(200);

    expect(response.body.length).to.equal(2);

    const tasks = response.body;
    tasks.forEach((task) => {
      expect(task.owner).to.equal(me._id.toHexString());
    });
  });

  it('get all tasks', async function () {
    const response = await request(app)
      .get('/tasks/all')
      .set('Authorization', `Bearer ${me.tokens[0].token}`)
      .send()
      .expect(200);

    expect(response.body.length).to.equal(3);
  });

  it('delete task', async function () {
    const id = tasks[0]._id;

    const response = await request(app)
      .delete(`/tasks/${id}`)
      .set('Authorization', `Bearer ${me.tokens[0].token}`)
      .send();

    expect(response.statusCode).to.equal(200);

    const task = await Task.findById(id);
    expect(task).to.be.null;
  });

  it('delete task (unauthorized)', async function () {
    const id = tasks[2]._id;

    const response = await request(app)
      .delete(`/tasks/${id}`)
      .set('Authorization', `Bearer ${me.tokens[0].token}`)
      .send();

    expect(response.statusCode).to.equal(400);

    const task = await Task.findById(id);
    expect(task).to.not.be.null;
  });
});
