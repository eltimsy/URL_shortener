'use strict';

const MongoClient = require('mongodb').MongoClient;


module.exports = function insertURL(db, short, long, cb) {
  MongoClient.connect(db, (err, db) => {
    if(err) {
      console.log('could not connect! Unexpected error. Details below');
      throw err;
    }

    db.collection('urls').insertOne( {
      shortURL: short,
      longURL: long
      }, function(err, result) {
        cb();
    });
  });
};
