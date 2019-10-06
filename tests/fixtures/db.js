const utilsJwt = require('../../src/utils/jwt');
const mongoose = require('mongoose');
const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

const idMe = new mongoose.Types.ObjectId();

const me = {
  _id: idMe,
  name: 'reuel',
  email: 'reuel.alvarez@gmail.com',
  role: 'block 1',
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
  role: 'block 4',
  password: 'bowshiP123!',
  tokens: [{
    token: utilsJwt.sign(idYou)
  }]
};

const tasks = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'reuel task 1',
    description: 'reuel task desc 1',
    dateDue: new Date().toISOString(),
    owner: idMe
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'reuel task 2',
    description: 'reuel task desc 2',
    dateDue: new Date().toISOString(),
    owner: idMe
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'ray task 1',
    description: 'ray task desc 1',
    dateDue: new Date().toISOString(),
    isCompleted: true,
    owner: idYou
  }
];

const init = async () => {
  await User.deleteMany();
  await Task.deleteMany();

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
};
