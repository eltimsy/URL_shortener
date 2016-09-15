'use strict';

const MongoClient = require('mongodb').MongoClient;


module.exports = function deleteURL(db, short, cb) {
  MongoClient.connect(db, (err, db) => {
    if(err) {
      console.log('could not connect! Unexpected error. Details below');
      throw err;
    }

    db.collection('urls').deleteOne( {
      shortURL: short
      }, function(err, result) {
        //console.log(result);
        cb();
    });
  });
};
