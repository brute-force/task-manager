const mongoose = require('mongoose');

(async () => {
    try {
        const opts = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
        await mongoose.connect('mongodb://localhost:27017/task-manager-api', opts);
    } catch (err) {
        console.log(`error connecting: ${err}`);
    }
})();
