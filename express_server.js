'use strict';
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;
const cookieParser = require('cookie-parser');

const generate = require('./lib/random-string.js');
const allAccess = require('./lib/all-access');
let conn;

app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));

MongoClient.connect(MONGODB_URI, (err, db) => {
  conn = db;
});

var shortenLink = 'https://goo.gl/';

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls')
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect('/urls')
});

app.get('/', (req, res) => {
  res.end("Hello!");
});

app.route('/urls')
  .get((req, res) => {
    allAccess.getDatabase(conn, (err, urls) => {
      res.render('./urls/index', {
        urls: urls,
        shortenLink: shortenLink,
        username: req.cookies["username"]
      });
    });
  })
  .post((req, res) => {
    let shortURL = generate(6)
    if(req.body.longURL.search(/^(ftp|http|https):\/\/[^ "]+$/)!== -1) {
      allAccess.insertURL(conn, shortURL, req.body.longURL, () => {
        res.redirect(`/urls/${shortURL}`);
      });
    } else {
      res.redirect('/urls/new')
    }
  });

app.get('/urls/new', (req, res) => {
  res.render('./urls/new', {
    username: req.cookies["username"]
  });
});

app.get("/u/:shortURL", (req, res) => {
  allAccess.longURL(conn, req.params.shortURL, (err, url) => {
    if(url !== null) {
      res.redirect(url.longURL);
    } else {
      res.redirect('/urls');
    }
  });
});

app.route('/urls/:id')
  .get((req, res) => {
    let short = { shortURL: req.params.id };

    allAccess.longURL(conn, short.shortURL, (err, longURL) => {
      if(longURL !== null) {
        res.render('./urls/show', {
          shortURL: short.shortURL,
          longURL: longURL.longURL,
          username: req.cookies["username"]
        });
      } else {
        res.redirect('/urls');
      }
    });
  })
  .delete((req, res) => {
    allAccess.deleteURL(conn, req.params.id, () => {
      res.redirect('/urls');
    });
  })
  .put((req, res) => {
    allAccess.updateURL(conn, req.params.id, req.body.changeURL, () => {
      res.redirect('/urls');
    });
  });


app.get('/hello', (req, res) => {
  res.end('<html><body>Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
