const express = require('express');
const Task = require('../models/Task');

const routerTasks = new express.Router();
const optsUpdate = { new: true, runValidators: true };

// get tasks
routerTasks.get('/tasks', async (req, res) => {
    const tasks = await Task.find({}).catch((err) => res.status(500).send());
    res.send(tasks);
});

// get task by id
routerTasks.get('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id).catch((err) => res.status(500).send());
    task ? res.send(task) : res.status(404).send();
});

// create task
routerTasks.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    await task.save()
        .then((taskSaved) => res.status(201).send(taskSaved))
        .catch((err) => res.status(400).send(`error saving task: ${err.message}`));
});

// update task
routerTasks.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const updateAllowables = ['description', 'isCompleted'];
    const doUpdate = updates.every((update) => updateAllowables.includes(update));

    if (doUpdate) {
        const task = await Task.findById(req.params.id).catch((err) => res.status(500).send());
        updates.forEach((update) => task[update] = req.body[update]);

        await task.save()
            .then((taskSaved) => res.send(taskSaved))
            .catch((err) => res.status(400).send(`error updating task: ${err.message}`));

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, optsUpdate)
        //     .catch((err) => res.status(400).send(err));

        // task ? res.send(task) : res.status(404).send();
    } else {
        res.status(400).send('invalid task update');
    }
});

// delete task
routerTasks.delete('/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id)
        .catch((err) => res.status(500).send(err));
    task ? res.send(task) : res.status(404).send();
});

module.exports = routerTasks;