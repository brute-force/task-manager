const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const utilsJWT = require('../utils/jwt');
const getModel = require('../db/mongoose');
const Task  = require('./Task');

const signOpts = {
    expiresIn: '10 seconds',
    algorithm: 'RS256'
};

const schemaUser = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error('E-mail invalid.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 10,
        trim: true,
        validate: (value) => {
            let errors = [];

            if (value.toLowerCase().includes('password')) {
                errors.push(`password must not contain 'password'`);
            }

            if (errors.length > 0) {
                throw new Error(errors.join('\n'));
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

// virtual property for tasks
schemaUser.virtual('tasks', { ref: 'Task', localField: '_id', foreignField: 'owner' });

// hash password before save
schemaUser.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

// delete tasks before remove
schemaUser.pre('remove', async function (next) {
    await Task.deleteMany({ owner: this._id });
    next();
});

// user log in
schemaUser.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
        .catch((err) => {
            throw err;
        });

    if (!user) {
        throw new Error('login error');
    }
    const isFound = await bcrypt.compare(password, user.password);

    if (!isFound) {
        throw new Error('login error');
    }

    return user;
};

// use jwt to sign this login and return a token
schemaUser.methods.generateAuthToken = async function() {
    try {
        const token = utilsJWT.sign(this._id);
        this.tokens.push({ token });
        await this.save();

        return token;
    } catch (err) {
        throw err;
    }
};

// get public profile for user
schemaUser.methods.getPublicProfile = function() {
    let obj = this.toObject();
    delete obj.password;
    delete obj.tokens;
    delete obj.avatar;

    return obj;
};

const User = getModel('User', schemaUser);

module.exports = User;