const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// use rsa keys for jwt
const keyPrivate  = fs.readFileSync(path.join(__dirname, '../private.key'));
const keyPublic  = fs.readFileSync(path.join(__dirname, '../public.key'));

const signOpts = {
    expiresIn: '600 seconds',
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