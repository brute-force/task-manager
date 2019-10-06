const utilsJWT = require('../utils/jwt');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace(/^Bearer /, '');
    const decoded = utilsJWT.verify(token);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error('Authentication error.');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: `Please log in. ${err.message}` });
  }
};

module.exports = auth;
