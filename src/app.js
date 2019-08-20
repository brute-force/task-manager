const express = require('express');
require('./db/mongoose');
const routerUsers = require('./routers/users');
const routerTasks = require('./routers/tasks');

const app = express();

app.use(express.json());
app.use(routerUsers);
app.use(routerTasks);

module.exports = app;