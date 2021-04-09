const express = require('express');

// express app
const app = express();



app.use(express.static('src'));
app.use('/img', express.static('./img'));

// listen for requests
app.listen(3000);

app.set('view engine','ejs');
app.set('views', 'src');

app.get('/', (req, res) => {
  res.render('views/index', { title: 'Welcome to Kanau'});
});

// redirects
app.get('/index', (req, res) => {
  res.redirect('/');
});

app.get('/account', (req, res) => {
  res.render('views/account-settings', { title: 'Kanau | Account'});
});

app.get('/about', (req, res) => {
  res.render('views/about-kanau', { title: 'Kanau | About us'});
});

app.get('/browse', (req, res) => {
  res.render('views/browse-main', { title: 'Kanau | Browse'});
});

app.get('/decks', (req, res) => {
  res.render('views/decks-main', { title: 'Kanau | Decks'});
});

app.get('/dictionary', (req, res) => {
  res.render('views/dictionary', { title: 'Kanau | Dictionary'});
});

app.get('/study', (req, res) => {
  res.render('views/study-session', { title: 'Kanau | Study'});
});


// 404 page
app.use((req, res) => {
  res.status(404).sendFile('./src/html/404.html', { root: __dirname });
});
