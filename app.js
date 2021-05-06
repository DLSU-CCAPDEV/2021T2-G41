const express = require('express');

const router = require('./routes/routes');

const app = express();

// make client-side scripts and files accessible
app.use(express.static('src'));
app.use('/img', express.static('./img'));
// takes url encoded data and parse it into an object usable from a req object
app.use(express.urlencoded({extended: true}));

// register view engine
app.set('view engine','ejs');
app.set('views', 'src');

app.listen(3000, function () {
  console.log('app listening at port ' + 3000);
});

app.use(router);

// 404 page
app.use((req, res) => {
  console.log("404 on URL: " + req.url);
  res.status(404).sendFile('./src/html/404.ejs', { root: __dirname });
});
