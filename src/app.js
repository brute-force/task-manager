const express = require('express');
require('./db/mongoose');
const routerUsers = require('./routers/users');
const routerTasks = require('./routers/tasks');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const path = require('path');

const app = express();

// support for vue router html5 history mode
// don't rewrite api requests
app.use(history({
  // verbose: true,
  rewrites: [
    {
      from: '/(users|tasks).*',
      to: function (context) {
        return context.parsedUrl.path;
      }
    }
  ]
}));
app.use(cors());
app.use(express.json());
app.use(routerUsers);
app.use(routerTasks);

// mount vue static files
const pathDist = path.join(__dirname, '../dist');
app.use(express.static(pathDist));

module.exports = app;
