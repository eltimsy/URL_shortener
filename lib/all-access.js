'use strict';

const MongoClient = require('mongodb').MongoClient;

function getDatabase(db, cb) {
  db.collection("urls").find().toArray((err, result) => {
    return cb(null, result);
  });
}

function deleteURL(db, short, cb) {
  db.collection('urls').deleteOne( {
    shortURL: short
    }, function(err, result) {
      cb();
    });
}


function insertURL(db, short, long, cb) {
  db.collection('urls').insertOne( {
    shortURL: short,
    longURL: long
    }, function(err, result) {
      cb();
  });
};

function getLongURL(db, shortURL, cb) {
  let query = { "shortURL": shortURL };
  db.collection("urls").findOne(query, (err, result) => {
    if (err) {
      return cb(err, result);
    }
    return cb(null, result);
  });
}

function updateURL(db, short, long, cb) {
  db.collection('urls').updateOne(
    { shortURL : short },
    { $set: { longURL : long }
  }, function(err, results) {
    cb();
  });
}

module.exports = {
  getDatabase: getDatabase,
  deleteURL: deleteURL,
  longURL: getLongURL,
  insertURL: insertURL,
  updateURL: updateURL
}
