const mongoose = require('mongoose');
const validator = require('validator');
const getModel = require('../db/mongoose');

const schemaTask = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Task = getModel('Task', schemaTask);

module.exports = Task;