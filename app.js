const express = require('express');
const router = require('./routes/routes');

// express app
const app = express();
// favicon
const favicon = require('serve-favicon');
const path = require('path');

// sessions app and mongoDB store
const session = require('express-session');
const MongoStore = require('connect-mongo');

// setup favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// setup session and cookies
app.use(session({
  secret: 'secret email', // also store this on an evironment variable
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://dbAdmin:admin123@kanaugcp.tm0gd.mongodb.net/Accounts?retryWrites=true&w=majority",
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

app.listen(3000, function () {
  console.log('app listening at port ' + 3000);
});

app.use(router);

// 404 page
app.use((req, res) => {
  console.log("404 on URL: " + req.url);
  res.status(404).render('404');
});
