'use strict';

const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/url_shortener';

console.log(`Connecting to MongoDb running at: ${MONGODB_URI}`);

MongoClient.connect(MONGODB_URI, (err, db) => {

  if(err) {
    console.log('could not connect! Unexpected error. Details below');
    throw err;
  }

  console.log('Connected to the database!');
  let collection = db.collection('urls');

  console.log(db.collection("urls").findOne());//{shortURL : "b2xVn2"}, {_id: 0}

  console.log('Retreiving documents for the "test" collection...');
  collection.find().toArray((err, results) => {
    console.log('results: ', results);

    console.log('Disconnecting from Mongo!');
    db.close();
  });
});
