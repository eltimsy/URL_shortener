'use strict';

const MongoClient = require('mongodb').MongoClient;


module.exports = function deleteURL(db, short, long, cb) {
  MongoClient.connect(db, (err, db) => {
    if(err) {
      console.log('could not connect! Unexpected error. Details below');
      throw err;
    }
    db.collection('urls').updateOne(
      { shortURL : short },
      { $set: { longURL : long }
      }, function(err, results) {
        cb();
    });
  });
};
