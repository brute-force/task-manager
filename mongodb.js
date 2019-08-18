const { MongoClient, ObjectID} = require('mongodb');
// import { MongoClient, ObjectID } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'task-manager';

const test = async () => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => console.log(err));

    if (client) {
        try {
            const db = await client.db(dbName);
            let collection = db.collection('tasks');

            // const tasks = [
            //     { description: 'finish that this book', isCompleted: false },
            //     { description: 'finish this node course', isCompleted: false },
            //     { description: 'eat a bk impossible burger and onion rings', isCompleted: true },
            //     { description: 'clean coffee table drawer', isCompleted: false }
            // ];
            
            // const responseInsertMany = await collection.insertMany(tasks);
            // responseInsertMany.ops.forEach(({description, isCompleted}, index) => console.log(`${++index}: ${description}; ${isCompleted ? '' : 'not'} done`));

            // const resultfindOne = await collection.findOne({ '_id': new ObjectID('5d5631e3529c0b376a85b8bf')});
            // console.log(resultfindOne);

            // const cursorFind = await collection.find({ isCompleted: false });
            // cursorFind.forEach(({description}) => console.log(`${description}`));

            // const results = await cursorFind.toArray();
            // results.forEach(({description}, index) => console.log(`${++index}: ${description}`));

            // collection = db.collection('users');

            // collection.updateOne({'_id': new ObjectID('5d56400143de7114d5a29ab3')}, {$set: {name: 'Ray'}, $inc: {age: 1}})
            //     .then(result => console.log(result))
            //     .catch(error => console.log(error));

            // { "acknowledged" : true, "matchedCount" : 2, "modifiedCount" : 2 }

            // collection.updateMany({isCompleted: true}, {$set: {isCompleted: false}})
            // .then(({ matchedCount, modifiedCount }) => console.log(`matched: ${matchedCount}, modified: ${modifiedCount}`))
            // // .then((result) => console.log(result))
            // .catch(error => console.log(error));

            // collection.updateOne({'_id': new ObjectID('5d5631e3529c0b376a85b8be')}, {$set: {isCompleted: true}})
            //     .then(result => console.log(result))
            //     .catch(error => console.log(error));

            const responseInsertOne = await collection.insertOne({ description: 'finish scotch', isCompleted: true });
            console.log(responseInsertOne.insertedCount);

            // const responseDeleteOne = await collection.deleteOne({ description: 'finish scotch' });
            // console.log(responseDeleteOne.deletedCount);

        } catch (err) {
            console.log(`error: ${err.message}`);
        } finally {
            client.close();
        }
    } else {
        console.log('blown');
    }
};

test();
