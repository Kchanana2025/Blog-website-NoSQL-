//this is basically a utility file
//Utility files are typically used in software development to store functions or classes that provide commonly used functionality across an application or system.
const mongodb = require('mongodb');//importing mongodb package

const MongoClient = mongodb.MongoClient;

async function connect() {
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017');//database server(joki locally run kr rha hai hmari machine par) se connection bna(basically connection pool bna)
    database = client.db('blog');// ek partcular database se connection bn gya
}

function getDb() {
    if (!database) {
        throw { message: 'Database connection not established !' };
    }
    return database;
}

module.exports = {
    connectToDatabase: connect,
    getDb: getDb
};
