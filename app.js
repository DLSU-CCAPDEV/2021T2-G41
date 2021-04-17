const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// get models
const Dictionary = require('./models/dictionary');
const Test = require('./models/test'); // TODO: add function call for specified collection name
const Flashcard = require('./models/flashcards');
var flashcardInfoModel = null, flashcardModel = null;

// express app & MongoDB URIs
const app = express();
const dictionaryURI = "mongodb+srv://dbAdmin:admin123@kanaugcp.tm0gd.mongodb.net/Dictionary?retryWrites=true&w=majority";
const flashcardURI = "mongodb+srv://dbAdmin:admin123@kanaugcp.tm0gd.mongodb.net/Flashcards?retryWrites=true&w=majority";

// connect to Dictionary database (default connection)
mongoose.connect(dictionaryURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(app.listen(3000))
    .catch(function(error) {
        console.log(error);
    });

// Other database connnections
const flashcardConnection = mongoose.createConnection(flashcardURI, {useNewUrlParser: true, useUnifiedTopology: true});

// Misc nodes
var personalDecks = null;

// make client-side scripts and files accessible
app.use(express.static('src'));
app.use('/img', express.static('./img'));

// register view engine
app.set('view engine','ejs');
app.set('views', 'src');

// takes url encoded data and parse it into an object usable from a req object
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('views/index', { title: 'Welcome to Kanau'});
});

app.get('/add', (req, res) => {
  Test.findOne({ data: "hello" })
  .then(result => console.log(result))
  .catch(err => console.log(err));

  Test.updateOne({ data: "hello" }, {newData: "hey!"})
  .then(result => console.log(result))
  .catch(err => console.log(err));
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
  var username = "sampleuser@test.com";

  // Prepare models
  if (!flashcardInfoModel) { // check if model has already been compiled
    var flashcardInfoSchema = Flashcard.FlashcardInfoSchema(username);
    flashcardInfoModel = flashcardConnection.model('tag', flashcardInfoSchema, username);
    console.log("created flashcardInfo model");
  }

  if (!flashcardModel) {
    var flashcardSchema = Flashcard.Flashcardschema(username);
    flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, username);
    console.log("created flashcard model");
  }

  // Get decks
  flashcardInfoModel.find({Tag: "Index"}, 'decks')
  .then(results => {
    console.log(results);
    personalDecks = results[0].decks.slice();
    console.log("assign decks...");
    console.log(personalDecks);

    personalDecks.forEach(deck => {
      flashcardModel.find({Deck: deck})
      .then(results =>
        console.log("GOT Flashcards!"))
      .catch(err =>
        console.log(err))
    });
  })
  .catch(err => console.log(err));

  res.render('views/decks-main', {decks: personalDecks, title: 'Kanau | Decks'});
});

app.get('/dictionary', function(req, res) {
    console.log("Requested term: " + req.query.termQuery);
    if (!req.query.termQuery) {
        res.render('views/dictionary.ejs', {Dictionary: null, isSearch: false, title: 'Kanau | About us'});
        res.end();
        return;
    }
    Dictionary.find({Kanji: {"$regex": req.query.termQuery, "$options": "i"} }).sort({TermID: 'asc'})
    .then(result => {
        console.log(result);
        let termKanji = [];
        let termKana = [];
        let termMeaning = []; // 2D Array containing multiple meanings per term

        let tempMeanings = []
        let trackTermID = -1;
        result.forEach(term => {
            if (term.TermID != trackTermID) { // new term found
                if (trackTermID != -1) { // append all recorded meanings
                    termMeaning.push(tempMeanings.slice());
                    tempMeanings.length = 0;
                }
                trackTermID = term.TermID;
                termKanji.push(term.Kanji);
                termKana.push(term.Kana);
                tempMeanings.push(term.Meaning);
            }
            else { // continue on to other meanings
                tempMeanings.push(term.Meaning);
            }
        });
        termMeaning.push(tempMeanings.slice());
        tempMeanings.length = 0;

        DictionaryResults = {
            "Kanjis": termKanji,
            "Kanas" : termKana,
            "Meanings": termMeaning
        }
        
        console.log("==== AFTER PARSING to readable object format ====");
        console.log(DictionaryResults);
        res.render('views/dictionary.ejs', {Dictionary: DictionaryResults, isSearch: true, title: 'Kanau | About us'});
    })
    .catch(error =>
        console.log(error));
});

app.get('/study', (req, res) => {
  res.render('views/study-session', { title: 'Kanau | Study'});
});

app.get('/testajax', (req, res) => {
  res.status(200).send('just some random testing going on here');
});

// 404 page
app.use((req, res) => {
  console.log("404 on URL: " + req.url);
  res.status(404).sendFile('./src/html/404.ejs', { root: __dirname });
});
