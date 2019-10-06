const express = require('express');
require('./db/mongoose');
const routerUsers = require('./routers/users');
const routerTasks = require('./routers/tasks');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routerUsers);
app.use(routerTasks);

module.exports = app;
