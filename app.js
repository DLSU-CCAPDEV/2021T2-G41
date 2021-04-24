const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// get schemas
const Dictionary = require('./models/dictionary');
const Test = require('./models/test'); // TODO: add function call for specified collection name
const Flashcard = require('./models/flashcards');
// set models
var flashcardInfoModel = null, flashcardModel = null, deckSettingModel = null;

// express app & MongoDB URIs
const app = express();
const dictionaryURI = "mongodb+srv://dbAdmin:admin123@kanaugcp.tm0gd.mongodb.net/Dictionary?retryWrites=true&w=majority";
const flashcardURI = "mongodb+srv://dbAdmin:admin123@kanaugcp.tm0gd.mongodb.net/Flashcards?retryWrites=true&w=majority";

var username = null; // Current user (based on email)

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
  username = "sampleuser@test.com";

  // Prepare models TODO: move these set statements outside
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

  if (!deckSettingModel) {
    var deckSettingSchema = Flashcard.DeckSettingSchema(username);
    deckSettingModel = flashcardConnection.model('deck settings', deckSettingSchema, username);
  }

  var _dueAndNewDecks = [] // 2D Array for storing deck settings [[due,new]]

  // Get decks
  flashcardInfoModel.find({Tag: "Index"}, 'decks') // Get deck names
  .then(results => {
    console.log(results);
    personalDecks = results[0].decks.slice();
    console.log("assign decks...");
    console.log(personalDecks);

    personalDecks.forEach((deck, index, array) => {
      // Get deck settings (max reviews/new)
      deckSettingModel.find({Tag: "Deck Settings", Deck: deck})
      .then(result => {
        console.log("GET Deck preferences for " + deck);
        console.log(result[0]);

        // TODO adjust new/review count based on actual decks returned after db query
        _dueAndNewDecks.push([result[0].MaxReviews, result[0].MaxNew]);
        console.log(_dueAndNewDecks + "deck preference GOT!");

        if (index == array.length - 1) {
          res.render('views/decks-main', {decks: personalDecks, _dueAndNewDecks, title: 'Kanau | Decks'});
          console.log("RENDERED EJS");
        }
      })
      .catch(err => console.log(err));
    })
    // TODO: No decks available
    // res.render('views/decks-main', {decks: personalDecks, _dueAndNewDecks: null, title: 'Kanau | Decks'});
  })
  .catch(err => console.log(err));
});

app.get('/dictionary', function(req, res) {
    console.log("Requested term: " + req.query.termQuery);
    if (!req.query.termQuery) {
        res.render('views/dictionary.ejs', {Dictionary: null, isSearch: false, title: 'Kanau | About us'});
        res.end();
        return;
    }
    Dictionary.find({Kanji: {"$regex": req.query.termQuery, "$options": "i"} }).sort({TermID: 'asc'}).limit(2)
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

app.get('/study/:deck', (req, res) => {
  console.log("ENTERED Study on deck: " + req.params.deck);
  res.render('views/study-session', {title: 'Kanau | Decks', deckName: req.params.deck});
});

app.get('/getStudyCards', (req, res) => {
  console.log("~~~~GET STUDY CARDS REQUEST~~~~");
  var _new, _review;
  let deckName = req.query.deck;
  let cards = {
    newCards: [],
    reviewCards: []
  };

  let currDate = new Date();
  console.log("Current date: " + currDate);

  console.log("GET deck AJAX Request! for " + deckName + ". Retrieving cards...");
  
  // Get deck settings, then get cards
  deckSettingModel.findOne({Tag: "Deck Settings", Deck: deckName})
  .then(result => {
    _new = result.MaxNew;
    _review = result.MaxReviews;

    /* Get Review cards, limit to maximum review setting
    Condition:if card review date is 1971-01-01T00:00:01.000Z, skip (new card)
              if card review date <= current date, due for review
              if card review date > current date, skip (not due)
  */
    flashcardModel.find({Deck: deckName, ReviewDate: {"$lte": currDate, "$ne": new Date("1970-01-01T00:00:01.000Z")}})
    .limit(_review)
    .then(reviewCards => {
      if (reviewCards.length == 0) {
        console.log("No cards due for review.");
      }
      else {
        // proceed to add review cards
        reviewCards.forEach(reviewCard => {
          cards.reviewCards.push(reviewCard);
          console.log("Added " + reviewCard + " to review cards.");
        });
      }

      /*  Get New cards, limit to maximum new setting
      Condition:if card review date is 1971-01-01T00:00:01.000Z, due for study
                if card review date <= or > current date, skip
      */
      flashcardModel.find({Deck: deckName, ReviewDate: new Date("1970-01-01T00:00:01.000Z")})
      .limit(_new)
      .then(newCards => {
        if (newCards.length == 0) {
          console.log("No New cards.");
        }
        else {
          // proceed to add new cards
          newCards.forEach(newCard => {
            cards.newCards.push(newCard);
            console.log("Added " + newCard + " to new cards.");
          });
        }
        res.send(cards);
      });

    });

  });

});

app.post('/passCard', (req, res) => {
  
});

app.post('/testajax', (req, res) => {
  console.log(req.body);
  res.status(200).send('just some random testing going on here');
});

// 404 page
app.use((req, res) => {
  console.log("404 on URL: " + req.url);
  res.status(404).sendFile('./src/html/404.ejs', { root: __dirname });
});
