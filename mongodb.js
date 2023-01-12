
const {MongoClient, ObjectId} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'    //Connect to localhost server
//better to write 127.0
const mongoose = require('mongoose')
const databaseName = 'task-manager' //database name- can pick anything we want


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    //called when connected to database. Connecting to db is not synchronous
    if(error) {
        return console.log('Unable to connect to db')
    }
    const db = client.db(databaseName)
    // db.collection('users').updateOne({_id: new ObjectId('63bbaceaad71c6d800103f9f')}, {$set: {name: 'Raj'}}).then((res, rej) => {
    //     console.log(res);

    // })
    // db.collection('tasks').updateMany({completed: false}, {$set: {completed: true}}).then((res) => {
    //     console.log(res)
    // }).catch((err) => {
    //     console.log(err)
    // })
    db.collection('tasks').deleteMany({
        // _id: new ObjectId('63bccc1c94f280716925e996'),
        completed: true
    }).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err)
    });
})


