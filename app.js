const express = require('express');
const router = require('./routes/routes');
const dotenv = require('dotenv');

dotenv.config();
const _Port = process.env.PORT;
const _Secret_Email = process.env.SECRET_EMAIL;
const _Account_URL = process.env.ACCOUNT_URL;

// express app
const app = express();
// favicon
const favicon = require('serve-favicon');
const path = require('path');

// sessions app and mongoDB store
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { hostname } = require('os');

// setup favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// setup session and cookies
app.use(session({
  secret: _Secret_Email, // also store this on an evironment variable
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: _Account_URL,
    collectionName: 'Sessions'
  }),
  cookie: {
    maxAge: 14000 * 60 * 60 * 24 // Equals 1 day (1 day * 24hr/1 day * 60min/1hr)
  }
}));

// make client-side scripts and files accessible
app.use(express.static('public'));

// takes url encoded data and parse it into an object usable from a req object
app.use(express.urlencoded({extended: true}));

// register view engine
app.set('view engine','ejs');

app.listen(_Port, () => {
  console.log('Server is running.');
  var x;
});

app.use(router);

// 404 page
app.use((req, res) => {
  console.log("404 on URL: " + req.url);
  res.status(404).render('404', {title: "Error 404 (Not Found)", error: req.url});
});
