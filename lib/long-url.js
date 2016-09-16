'use strict';

const MongoClient = require('mongodb').MongoClient;


module.exports = function getLongURL(db, shortURL, cb) {
  MongoClient.connect(db, (err, db) => {
    if(err) {
      console.log('could not connect! Unexpected error. Details below');
      throw err;
    }

    let query = { "shortURL": shortURL };
    db.collection("urls").findOne(query, (err, result) => {
      if (err) {
        return cb(err, result);
      }
      return cb(null, result);
    });
  });
}
