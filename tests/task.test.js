const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');
const { init, me, tasks } = require('./fixtures/db')

const myTask = {
    description: 'finish section 16',
    isCompleted: true
};

beforeEach(init);

test('create task', async () => { 
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${me.tokens[0].token}`)
        .send({ ...myTask, owner: me._id })
        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();

    expect(response.body).toMatchObject(myTask);
});

test('get tasks', async () => { 
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${me.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(2);

    const tasks = response.body;
    tasks.forEach((task) => {
        expect(task.owner).toBe(me._id.toHexString());
    });
});

test('delete task; unauthorized', async () => { 
    const id = tasks[2]._id;

    const response = await request(app)
        .delete(`/tasks/${id}`)
        .set('Authorization', `Bearer ${me.tokens[0].token}`)
        .send()
        .expect(400);

    const task = await Task.findById(id)
    expect(task).not.toBeNull();
});

test('delete task', async () => { 
    const id = tasks[0]._id;

    const response = await request(app)
        .delete(`/tasks/${id}`)
        .set('Authorization', `Bearer ${me.tokens[0].token}`)
        .send()
        .expect(200);

    const task = await Task.findById(id)
    expect(task).toBeNull();
});
