const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// get schemas
const Dictionary = require('./models/dictionary');
const Test = require('./models/test'); // TODO: add function call for specified collection name
const Flashcard = require('./models/flashcards');
const { DeckSettingSchema } = require('./models/flashcards');
// set models
var decksInfoModel = null, flashcardModel = null, deckSettingModel = null;

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
const flashcardConnection = mongoose.createConnection(flashcardURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

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
  let username2 = "newuser@new.com";
  let premadeDecksCollection = "sampleuser@test.com";
  let chosenDecks = ["JLPT N5 Kanji Deck"] ; // Push deck names here (for Tag: Index document)

  let flashcardSchema = Flashcard.Flashcardschema(username2);
  let DecksInfoSchema = Flashcard.DecksInfoSchema(username2);
  let DeckSettingSchema = Flashcard.DeckSettingSchema(username2)

  // Model for accessing premade decks
  let FlashcardCopyModel = flashcardConnection.model('flashcardCopy', flashcardSchema, premadeDecksCollection);

  // destination db model, use this to create documents and access save()
  let FlashcardDestinationModel = flashcardConnection.model('flashcardDestination', flashcardSchema, username2);
  let DecksInfoCopyModel = flashcardConnection.model('decksInfoCopy', DecksInfoSchema, username2);
  let DeckSettingCopyModel = flashcardConnection.model('deckSettingCopy', DeckSettingSchema, username2);

  chosenDecks.forEach(chosenDeck => {
    console.log(chosenDeck + " available!");
    // Create Deck Setting per deck
    let deckSettingCopyDocument = new DeckSettingCopyModel({
      Tag: "Deck Settings",
      Deck: chosenDeck,
      MaxNew: 10, // default
      CurrentNew: 0,
      LastStudied: "1970-01-01T00:00:01.000Z"
    })
    deckSettingCopyDocument.save()
    .then(() => console.log("Deck settings for " + chosenDeck + " created."));
    
    console.log("Adding premade flashcards for deck " + chosenDeck + "...");
    let trackProgressDeck, i = 0;
    // Copy Flashcards from each deck
    FlashcardCopyModel.find({Tag: null, Deck: chosenDeck})
    .then(FlashcardCopyResults => {
      trackProgressDeck = FlashcardCopyResults.length;
      FlashcardCopyResults.forEach(FlashcardCopyResult => {
        // copy each premade flashcard to new document
        let FlashcardCopyDocument = new FlashcardDestinationModel({
          FrontWord: FlashcardCopyResult.FrontWord,
          BackWord: FlashcardCopyResult.BackWord,
          Deck: FlashcardCopyResult.Deck,
          ReviewDate: FlashcardCopyResult.ReviewDate
        });

        FlashcardCopyDocument.save().then(() => {
          i += 1;
          console.log(i + "/" + trackProgressDeck + " duplicated.");
        });
      })
    })
    .catch(err => console.log(err));
  });

  // Create DecksInfo document
  let decksInfoCopyDocument = new DecksInfoCopyModel({
    Tag: "Index",
    decks: chosenDecks
  });
  decksInfoCopyDocument.save();

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
  username = "newuser@new.com";

  // Prepare models TODO: move these model init statements outside
  if (!decksInfoModel) { // check if model has already been compiled
    var decksInfoSchema = Flashcard.DecksInfoSchema(username);
    decksInfoModel = flashcardConnection.model('tag', decksInfoSchema, username);
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

  let _dueAndNewDecks = [] // 2D Array for storing new/review count [[due,new]]
  let _due, _new; // track new/review count for each deck
  let currDate = new Date(new Date().toDateString());

  // Get decks
  decksInfoModel.find({Tag: "Index"}, 'decks') // Get deck names
  .then(decksInfoResults => {
    personalDecks = decksInfoResults[0].decks.slice();
    console.log("THE DECK NAMES ARE: ");
    console.log(personalDecks);

    personalDecks.forEach((deck, index, array) => {
      // Get deck settings (max reviews/new)
      deckSettingModel.find({Tag: "Deck Settings", Deck: deck})
      .then(deckSettingResult => {
        console.log("GET Deck preferences for " + deck);
        console.log(deckSettingResult[0]);

        // adjust new/review count based on actual decks returned after db query
        // get NEW count, limit on maximum new card setting OR current new count
        if (deckSettingResult[0].LastStudied == null) { // Deck that has not been studied ever
          flashcardModel.find({Deck: deck, ReviewDate: new Date("1970-01-01T00:00:01.000Z")})
          .limit(deckSettingResult[0].MaxNew)
          .then(newCountResult => {
            console.log("Deck - " + deck + " NOT studied.");
            if (newCountResult.length > deckSettingResult[0].MaxNew)
              _new = deckSettingResult[0].MaxNew;
            else 
              _new = newCountResult.length;
          })
        }
        else if (deckSettingResult[0].LastStudied.toISOString() == currDate.toISOString()) { // Deck studied on the same current day
          flashcardModel.find({Deck: deck, ReviewDate: new Date("1970-01-01T00:00:01.000Z")})
          .limit(deckSettingResult[0].CurrentNew)
          .then(newCountResult => {
            console.log("Deck " + deck + " ready for REPEAT study session.");
            _new = newCountResult.length;
          })
        } else { 
          // new study session
          flashcardModel.find({Deck: deck, ReviewDate: new Date("1970-01-01T00:00:01.000Z")})
          .limit(deckSettingResult[0].MaxNew)
          .then(newCountResult => {
            console.log("Deck " + deck + " ready for NEW study session.");
            if (newCountResult.length > deckSettingResult[0].MaxNew)
              _new = deckSettingResult[0].MaxNew;
             else 
              _new = newCountResult.length;
          })
        }

        // track new card count per deck
        deckSettingModel.findOneAndUpdate({Tag: "Deck settings", Deck: deck}, {CurrentNew: _new}).exec();
        
        // Review card count, NO limit on maximum review count
        flashcardModel.find({Deck: deck, ReviewDate: {"$lte": currDate, "$ne": new Date("1970-01-01T00:00:01.000Z")}})
        .then(reviewCountResult => {
          _due = reviewCountResult.length;

          _dueAndNewDecks.push([_due, _new]);
          console.log(_dueAndNewDecks + " [[due, new]] deck preference GOT!");
  
          if (index == array.length - 1) {
            console.log(_dueAndNewDecks);
            res.render('views/decks-main', {decks: personalDecks, _dueAndNewDecks, title: 'Kanau | Decks'});
            console.log("RENDERED EJS");
          }
        });
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
  let currDate = new Date(new Date().toDateString());
  let _currentNew;

  // new study session, update LastStudied and CurrentNew fields for tracking
  deckSettingModel.find({Tag: "Deck Settings", Deck: req.params.deck})
  .then(deckSettingResult => {
    if (currDate.toISOString() != deckSettingResult[0].LastStudied.toISOString()) { // new study session
      console.log("NEW study session!");

      // get "new" new count
      flashcardModel.find({Deck: req.params.deck, ReviewDate: new Date("1970-01-01T00:00:01.000Z")})
      .limit(deckSettingResult[0].MaxNew)
      .then(newCards => {
        _currentNew = newCards.length

        deckSettingModel.updateOne({Tag: "Deck Settings", Deck: req.params.deck}, {CurrentNew: _currentNew, LastStudied: currDate}).exec();
      });
    }
  });

  res.render('views/study-session', {title: 'Kanau | Decks', deckName: req.params.deck});
});

app.get('/getStudyCards', (req, res) => {
  let deckName = req.query.deck;
  let cards = {
    newCards: [],
    reviewCards: []
  };

  let currDate = new Date(new Date().toDateString());
  console.log("Current date: " + currDate.toISOString());

  console.log("GET deck AJAX Request! for " + deckName + ". Retrieving cards...");
  
  // Get deck settings, then get cards
  deckSettingModel.findOne({Tag: "Deck Settings", Deck: deckName})
  .then(deckSettingResult => {
    console.log(deckSettingResult);
    /* Get Review cards, limit to maximum review setting
    Condition:if card review date is 1971-01-01T00:00:01.000Z, skip (new card)
              if card review date <= current date, due for review
              if card review date > current date, skip (not due)
  */
    flashcardModel.find({Deck: deckName, ReviewDate: {"$lte": currDate, "$ne": new Date("1970-01-01T00:00:01.000Z")}})
    .then(reviewCards => {
      if (reviewCards.length == 0) {
        console.log("No cards due for review.");
      }
      else {
        // proceed to add review cards
        reviewCards.forEach(reviewCard => {
          cards.reviewCards.push(reviewCard);
        });
      }

      /*  Get New cards, limit to maximum new setting
      Condition:if card review date is 1971-01-01T00:00:01.000Z, due for study
                if card review date <= or > current date, skip
      */
      flashcardModel.find({Deck: deckName, ReviewDate: new Date("1970-01-01T00:00:01.000Z")})
      .limit(deckSettingResult.CurrentNew)
      .then(newCards => {
        if (newCards.length == 0) {
          console.log("No New cards.");
        }
        else {
          // proceed to add new cards
          newCards.forEach(newCard => {
            cards.newCards.push(newCard);
          });
        }
        res.send(cards);
      });

    });

  });

});

app.post('/passCard', (req, res) => {
  const card = JSON.parse(req.body.card);

  let currReviewDate = new Date(new Date().toDateString());
  let _currentNew;

  // Get current new count
  deckSettingModel.findOne({Tag: "Deck Settings", Deck: card.Deck})
  .then(deckSettingResults => {
    _currentNew = deckSettingResults.CurrentNew;

    // decrement new count and update
    if (card.ReviewDate == "1970-01-01T00:00:01.000Z")
      deckSettingModel.updateOne({Tag: "Deck Settings", Deck: card.Deck}, {CurrentNew: (_currentNew-1)}).exec();
  })

  // update card review interval and review date
  if (card.ReviewInterval == null) { // new card, setup its first review date
    let newReviewInterval, newReviewDate = new Date(new Date().toDateString());
    newReviewInterval = 1;
    newReviewDate.setDate(newReviewDate.getDate() + newReviewInterval);

    flashcardModel.findByIdAndUpdate(card._id, {ReviewInterval: 1, ReviewDate: newReviewDate.toISOString()})
    .then(result => {
      res.send("(Pass, NEW) Updated card review interval.");
    })
    .catch(err => console.log(err));
  }

  else if (card.ReviewInterval != null) {
    let newReviewInterval, newReviewDate = new Date(new Date().toDateString());
    flashcardModel.findById(card._id)
    .then(result => {
      newReviewInterval = result.ReviewInterval * 2;
      newReviewDate.setDate(newReviewDate.getDate() + newReviewInterval);
      
      flashcardModel.findByIdAndUpdate(card._id, {ReviewInterval: newReviewInterval, ReviewDate: newReviewDate.toISOString()})
      .then(result => {
        res.send("(Pass) Updated card review interval.");
        return;
      })
      .catcH(err => console.log(err))
    })
    .catch(err => console.log(err));
  }

});

app.post('/failCard', (req, res) => {
  const card = JSON.parse(req.body.card);

  flashcardModel.findByIdAndUpdate(card._id, {ReviewInterval: 1})
  .then(result => {
    res.send("(Fail) Resetted card review interval.");
    return;
  })
});

app.get('/getFlashcardData', (req, res) => {
  flashcardModel.find({Tag: null}).then(flashcardResults => {
    console.log("Retrieved all flashcard data [NO FILTER]. Returning to view...");
    console.log(flashcardResults);
    res.send(flashcardResults);
  });
});

app.get('/getFlashcardDataFilter', (req, res) => {

});

app.post('/testajax', (req, res) => {
  console.log("AJAX REQUEST DATA IS: ");
  console.log(req.body);

  res.status(200).send('just some random testing going on here');
});

// 404 page
app.use((req, res) => {
  console.log("404 on URL: " + req.url);
  res.status(404).sendFile('./src/html/404.ejs', { root: __dirname });
});
