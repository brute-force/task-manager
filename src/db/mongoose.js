const mongoose = require('mongoose');

(async () => {
    try {
        const opts = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
        await mongoose.connect(`${process.env.MONGODB_SCHEME}://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/task-manager-api`, opts);
    } catch (err) {
        console.log(`error connecting: ${err.message}`);
    }
})();
