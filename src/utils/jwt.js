const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// use rsa keys for jwt
let keyPrivate = process.env.KEY_PRIVATE ? process.env.KEY_PRIVATE : fs.readFileSync(path.join(__dirname, '../private.key'));
let keyPublic = process.env.KEY_PUBLIC ? process.env.KEY_PUBLIC : fs.readFileSync(path.join(__dirname, '../public.key'));

const signOpts = {
    expiresIn: '1 hour',
    algorithm: 'RS256'
};

const sign = (id) => {
    try {
        const token = jwt.sign({ _id: id },  keyPrivate, signOpts);
        return token;
    } catch (err) {
        throw err;
    }
};

const verify = (token) => {
    try {
        const decoded = jwt.verify(token, keyPublic);
        return decoded;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    keyPrivate,
    keyPublic,
    sign,
    verify
};