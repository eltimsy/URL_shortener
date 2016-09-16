'use strict';
const MONGODB_URI = 'mongodb://127.0.0.1:27017/url_shortener';

var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
var generate = require('./random-string.js');
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
var getLongURL = require('./longurl.js');
var accessData = require('./accessdatabase.js');
var insertURL = require('./insert-data.js');
var deleteURL = require('./delete-url.js');
var updateURL = require('./update-url.js');


var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};
var shortenLink = 'https://goo.gl/';

app.get('/', (req, res) => {
  res.end("Hello!");
});

app.route('/urls')
  .get((req, res) => {
    let templateVars = { urls: urlDatabase };
    accessData(MONGODB_URI, (err, database) => {
      res.render('urls_index', {
        templateVars: database,
        shortenLink: shortenLink
      });
    });
  })
  .post((req, res) => {
    console.log(req.body);
    let shortURL = generate(6)
    if(req.body.longURL.search(/^(ftp|http|https):\/\/[^ "]+$/)!== -1) {
      insertURL(MONGODB_URI, shortURL, req.body.longURL, () => {
        res.redirect(`/urls/${shortURL}`);
      });
    } else {
      res.redirect('/urls/new')
    }
  });

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.get("/u/:shortURL", (req, res) => {
  getLongURL(MONGODB_URI, req.params.shortURL, (err, longURL) => {
    res.redirect(longURL);
  });
});

app.route('/urls/:id')
  .get((req, res) => {
    let templateVars = { shortURL: req.params.id };

    getLongURL(MONGODB_URI, templateVars.shortURL, (err, longURL) => {
      if(longURL !== null) {
        res.render('urls_show', {
          templateVars: templateVars.shortURL,
          longURL: longURL.longURL
        });
      } else {
        res.redirect('/urls');
      }
    });
  })
  .delete((req, res) => {
    deleteURL(MONGODB_URI, req.params.id, () => {
      //delete urlDatabase[req.params.id]
      res.redirect('/urls');
    });
  })
  .put((req, res) => {
    updateURL(MONGODB_URI, req.params.id, req.body.changeURL, () => {
      //urlDatabase[req.params.id] = req.body.changeURL
      res.redirect('/urls');
    });
  });


app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


app.get('/hello', (req, res) => {
  res.end('<html><body>Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
