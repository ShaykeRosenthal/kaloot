const { MongoClient } = require('mongodb');
const mongo = require('mongodb')
var objectId = mongo.ObjectId
async function _connect_2_DB() { //returns the db from mongoDB
    require('dotenv').config()
    const uri = `mongodb+srv://shaykeBaloot:${process.env.DB_PASSWORD}@balootdb.gnpvr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: false });
    try {
        await client.connect()
        const db = await client.db(process.env.DB_NAME);
        return db;
    } catch (err) {
        console.log(err)
        return false;
    }


}

async function getDocById(collection, docId = '') {
    try {
        var res = (docId.length !== 0) ? await collection.find({ _id: mongo.ObjectId(docId) }).toArray() : false;
        res === false ? console.log(`couldn't find by Id`) : '';
        return res
    } catch (err) {
        console.log(`couldn't get Baloot, please check Id`)
        return false;
    }

}

async function getCollection(collectionName) {
    try {
        // const client = await connect()
        const db = await _connect_2_DB()
        let collection = db ? db.collection(collectionName) : false;
        return collection;
    }
    catch (err) {
        console.log(err)
    }
}


module.exports = {
    getCollection,
    getDocById
}