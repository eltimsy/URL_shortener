'use strict';

var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
var generate = require('./random-string.js');

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};
var shortenLink = 'https://goo.gl/';

app.get('/', (req, res) => {
  res.end("Hello!");
});

app.get('/urls', (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render('urls_index', {
    templateVars: templateVars,
    shortenLink: shortenLink

  });
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls', (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  let shortURL = generate(6)
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls/:id', (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render('urls_show', {
    templateVars: templateVars.shortURL
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
