const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// use rsa keys for jwt
const keyPrivate = process.env.KEY_PRIVATE ? process.env.KEY_PRIVATE : fs.readFileSync(path.join(__dirname, '../private.key'));
const keyPublic = process.env.KEY_PUBLIC ? process.env.KEY_PUBLIC : fs.readFileSync(path.join(__dirname, '../public.key'));

const signOpts = {
  expiresIn: '1 day',
  algorithm: 'RS256'
};

const sign = (id) => {
  return jwt.sign({ _id: id }, keyPrivate, signOpts);
};

const verify = (token) => {
  return jwt.verify(token, keyPublic);
};

module.exports = {
  keyPrivate,
  keyPublic,
  sign,
  verify
};
