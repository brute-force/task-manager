const mongoose = require('mongoose');

(async () => {
    try {
        let login = '';
        let params = '';
        let port = '';

        // handle srv mongodb urls
        if (process.env.MONGODB_SCHEME === 'mongodb+srv') {
            login = `${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@`;
            params = '?retryWrites=true';
        } else {
            port = `:${process.env.MONGODB_PORT}`;
        }

        const url = process.env.MONGODB_SCHEME + '://' + login + process.env.MONGODB_HOST + port + '/' + 
            process.env.MONGODB_DATABASE + params;

        const opts = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };

        await mongoose.connect(url, opts);
    } catch (err) {
        console.log(`error connecting: ${err.message}`);
    }
})();
