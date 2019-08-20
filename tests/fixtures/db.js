const utilsJwt = require('../../src/utils/jwt');
const mongoose = require('mongoose');
const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

const idMe = new mongoose.Types.ObjectId();

const me = {
    _id: idMe,
    name: 'reuel',
    email: 'reuel.alvarez@gmail.com',
    password: 'walevaWack123!',
    tokens: [{
        token: utilsJwt.sign(idMe)
    }]
};

const idYou = new mongoose.Types.ObjectId();

const you = {
    _id: idYou,
    name: 'ray',
    email: 'ray@yahoo.com',
    password: 'bowshiP123!',
    tokens: [{
        token: utilsJwt.sign(idYou)
    }]
};

const tasks = [
    {
        _id: new mongoose.Types.ObjectId(),
        description: 'reuel task 1',
        owner: idMe
    },
    {
        _id: new mongoose.Types.ObjectId(),
        description: 'reuel task 2',
        owner: idMe
    },
    {
        _id: new mongoose.Types.ObjectId(),
        description: 'ray task 1',
        isCompleted: true,
        owner: idYou
    }
]

const init = async () => {
    await User.deleteMany();
    await Task.deleteMany()

    await new User(me).save();
    await new User(you).save();

    tasks.forEach(async (task) => {
        await new Task(task).save();
    });
};

module.exports = {
    init,
    me,
    tasks
}