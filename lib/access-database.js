'use strict';

const MongoClient = require('mongodb').MongoClient;


module.exports = function getDatabase(db, cb) {
  MongoClient.connect(db, (err, db) => {
    if(err) {
      console.log('could not connect! Unexpected error. Details below');
      throw err;
    }

    //let query = { "shortURL": shortURL };
    db.collection("urls").find().toArray((err, result) => {

      //db.close();
      return cb(null, result);
    });
  })
}
