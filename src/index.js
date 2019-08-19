const express = require('express');
require('./db/mongoose');
const routerUsers = require('./routers/users');
const routerTasks = require('./routers/tasks');

const app = express();

app.use(express.json());
app.use(routerUsers);
app.use(routerTasks);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server up on ${port}`);
});
