const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

const routerTasks = new express.Router();
// const optsUpdate = { new: true, runValidators: true };

// get tasks
// params:
// -isCompleted true/false
// -limit int
// -skip int
// -sortBy field:asc/desc
routerTasks.get('/tasks', auth, async (req, res) => {
  // retrieve via search by owner
  // const tasks = await Task.find({ owner: req.user._id }).catch((err) => res.status(500).send());

  // retrieve via populating user tasks
  const match = req.query.isCompleted ? { isCompleted: (req.query.isCompleted === 'true') } : {};

  // query options
  const options = {
    limit: parseInt(req.query.limit),
    skip: parseInt(req.query.skip),
    sort: {}
  };

  // parse sort
  if (req.query.sortBy) {
    const sortComponents = req.query.sortBy.split(':');
    options.sort[sortComponents[0]] = (sortComponents[1].toLowerCase() === 'desc') ? -1 : 1;
  }

  await req.user.populate({ path: 'tasks', match, options }).execPopulate().catch((err) => {
    console.log(err);
    res.status(500).send();
  });
  res.send(req.user.tasks);
});

// get all tasks
routerTasks.get('/tasks/all', auth, async (req, res) => {
  const tasks = await Task.find({ }).populate('owner', 'name email').exec().catch((err) => {
    console.log(err);
    res.status(500).send();
  });

  if (tasks) {
    res.send(tasks);
  } else {
    res.status(404).send();
  }
});

// get task by id
routerTasks.get('/tasks/:id', auth, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id }).catch((err) => {
    console.log(err);
    res.status(500).send();
  });

  if (task) {
    res.send(task);
  } else {
    res.status(404).send();
  }
});

// create task
routerTasks.post('/tasks', auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  await task.save()
    .then((taskSaved) => res.status(201).send(taskSaved))
    .catch((err) => res.status(400).send(`error saving task: ${err.message}`));
});

// update task
routerTasks.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const updateAllowables = ['title', 'description', 'dateDue', 'isCompleted'];
  const doUpdate = updates.every((update) => updateAllowables.includes(update));

  if (doUpdate) {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id }).catch((err) => {
      console.log(err);
      res.status(500).send();
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save()
      .then((taskSaved) => res.send(taskSaved))
      .catch((err) => res.status(400).send(`error updating task: ${err.message}`));
  } else {
    res.status(400).send('invalid task update');
  }
});

// delete task
routerTasks.delete('/tasks/:id', auth, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    .catch((err) => res.status(500).send(err));

  if (task) {
    res.send(task);
  } else {
    res.status(400).send();
  }
});

module.exports = routerTasks;
