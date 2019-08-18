const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const routerUsers = new express.Router();
const optsUpdate = { new: true, runValidators: true };

// log in user
routerUsers.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// log out user
routerUsers.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// log out user (all sessions)
routerUsers.get('/users/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// get user me
routerUsers.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
    // const users = await User.find({}).catch((err) => res.status(500).send());
    // res.send(users);
});

// get user by id
routerUsers.get('/users/:id', auth, async (req, res) => {
    const user = await User.findById(req.params.id).catch((err) => res.status(500).send());
    user ? res.send(user) : res.status(404).send();
});

// create user
routerUsers.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(`error saving user: ${err.message}`);
    }

    // const token = await user.generateAuthToken();

    // await user.save()
    //     .then((userSaved) => res.status(201).send(userSaved))
    //     .catch((err) => res.status(400).send(`error saving user: ${err.message}`));
});

// update user
routerUsers.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const updateAllowables = ['name', 'email', 'password', 'age'];
    const doUpdate = updates.every((update) => updateAllowables.includes(update));

    if (doUpdate) {
        // do findById()/update/save() instead of findByIdAndUpdate() so pre hook on user model fires
        const user = await User.findById(req.params.id).catch((err) => res.status(500).send());
        updates.forEach((update) => user[update] = req.body[update]);

        await user.save()
            .then((userSaved) => res.send(userSaved))
            .catch((err) => res.status(400).send(`error updating user: ${err.message}`));

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, optsUpdate)
        //     .catch((err) => res.status(400).send(err));
        // user ? res.send(user) : res.status(404).send();
    } else {
        res.status(400).send('invalid user update');
    }
});

// delete user
routerUsers.delete('/users/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
        .catch((err) => res.status(500).send(err));
    user ? res.send(user) : res.status(404).send();
});

module.exports = routerUsers;