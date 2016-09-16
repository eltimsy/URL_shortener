'use strict';
const MONGODB_URI = 'mongodb://127.0.0.1:27017/url_shortener';

const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');

const generate = require('./random-string.js');
const methodOverride = require('method-override');

const getLongURL = require('./lib/long-url');
const accessData = require('./lib/access-database');
const insertURL = require('./lib/insert-data');
const deleteURL = require('./lib/delete-url');
const updateURL = require('./lib/update-url');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));
//var cookiePraser = require('cookie-parser');
//app.use(cookieParser());

var shortenLink = 'https://goo.gl/';

app.get('/', (req, res) => {
  res.end("Hello!");
});

app.route('/urls')
  .get((req, res) => {
    //let templateVars = { urls: urlDatabase };
    accessData(MONGODB_URI, (err, database) => {
      res.render('urls_index', {
        templateVars: database,    /// urls: urls
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
  getLongURL(MONGODB_URI, req.params.shortURL, (err, url) => {
    console.log(longURL)
    res.redirect(url.longURL);
  });
});

app.route('/urls/:id')
  .get((req, res) => {
    let templateVars = { shortURL: req.params.id };

    getLongURL(MONGODB_URI, templateVars.shortURL, (err, longURL) => {
      if(longURL !== null) {
        res.render('urls_show', {
          templateVars: templateVars.shortURL,  // shortURL: req.params.id
          longURL: longURL.longURL
        });
      } else {
        res.redirect('/urls');
      }
    });
  })
  .delete((req, res) => {
    deleteURL(MONGODB_URI, req.params.id, () => {
      res.redirect('/urls');
    });
  })
  .put((req, res) => {
    updateURL(MONGODB_URI, req.params.id, req.body.changeURL, () => {
      res.redirect('/urls');
    });
  });


//app.get('/urls.json', (req, res) => {
  //res.json(urlDatabase);
//});


app.get('/hello', (req, res) => {
  res.end('<html><body>Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
