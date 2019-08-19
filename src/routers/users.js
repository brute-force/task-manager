const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');

const routerUsers = new express.Router();
const optsUpdate = { new: true, runValidators: true };

// log in user
routerUsers.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user: user.getPublicProfile(), token });
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
    res.send({ user: req.user.getPublicProfile(), token: req.token });
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
        res.status(201).send({ user: user.getPublicProfile(), token })
    } catch (err) {
        res.status(400).send(`error saving user: ${err.message}`);
    }
});

// update user
routerUsers.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const updateAllowables = ['name', 'email', 'password', 'age'];
    const doUpdate = updates.every((update) => updateAllowables.includes(update));

    if (doUpdate) {
        updates.forEach((update) => req.user[update] = req.body[update]);

        await req.user.save()
            .then((userSaved) => res.send(userSaved.getPublicProfile()))
            .catch((err) => res.status(400).send(`error updating user: ${err.message}`));
    } else {
        res.status(400).send('invalid user update');
    }
});

// delete yoself
routerUsers.delete('/users/me', auth, async (req, res) => {
    await req.user.remove().catch((err) => res.status(500).send(err));
    res.send(req.user);
});

// upload options
const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, filename, callback) {
        // filter filename extensions
        if (!/\.(jpg|jpeg|png)$/.test(filename.originalname.toLowerCase())) {
            return callback(new Error('file must be a jpg|jpeg|png'));
        }
        
        callback(null, true);
    }
});

// user avatar upload
routerUsers.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send();
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
});

module.exports = routerUsers;