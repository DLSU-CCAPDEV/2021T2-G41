const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// import module `validationResult` from `express-validator`
const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt');

// get schemas
const Dictionary = require('../models/dictionary');
const { DecksInfoSchema } = require('../models/flashcards');
const Flashcard = require('../models/flashcards');
const Sentence = require('../models/sentence');
const SentenceTranslation = require('../models/sentence_translation');
const User = require('../models/user');

// express app & MongoDB URIs
dotenv.config();
const dictionaryURI = process.env.DICTIONARY_URL;
const flashcardURI = process.env.FLASHCARD_URL;
const accountURI = process.env.ACCOUNT_URL;

// connect to Account database (default connection)
mongoose.connect(accountURI, {useNewUrlParser: true, useUnifiedTopology: true})
     .catch(function(error) {
         console.log(error);
     });

// Other database connnections
const flashcardConnection = mongoose.createConnection(flashcardURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const dictionaryConnection = mongoose.createConnection(dictionaryURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const accountConnection = mongoose.createConnection(accountURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const controller = {

    getIndex: (req, res) => {

		// check session if valid, redirect to decks
		if (req.session.email != null) {
			console.log("Valid session. Redirecting to decks...");
			res.redirect('/decks');
		}
      
        var details = {
          register_email_input_error: '',
          register_password_input_error: '',
          register_password_confirm_input_error: '',
          login_email_input_error: '',
          login_password_input_error: '',
        };
      
        res.render('index', { title: 'Welcome to Kanau', details});
    },

    checkRegister: (req, res) => {
        userModel = mongoose.model('Client', User);
        var email = req.query.Email;
      
        userModel.findOne({Email: email}) //looks for the same email that the user input in register form
          .then(result => {
            if(result)
              console.log(result);
            res.send(result);
          });
    },
    
    postRegister: (req, res) => {

        var errors = validationResult(req);

        userModel = mongoose.model('Client', User);

        // server-side validation
        if (!errors.isEmpty()) {
          errors = errors.errors;
          var details = {};
            for(i = 0; i < errors.length; i++)
              details[errors[i].param + '_error'] = errors[i].msg;
      
            res.render('index', { title: 'Welcome to Kanau', details});            
        }
        else {
          
          //hash password
          bcrypt.hash(req.body.register_password_input, 10, function(err, hash){

            // stores the values from the register form
            var newUser = new userModel({
              Email: req.body.register_email_input,
              Password: hash
            });

            let username = newUser.Email;

            // add email to sessions, bind to cookie
            req.session.email = username;
            console.log("username: " + username);

            //save new user to db
            newUser.save()
              .then((result) => {
                 res.redirect('/chooseDeck');
              })
          })
        }
    },

    postLogin: (req, res) => {

        var errors = validationResult(req);
      
        if (!errors.isEmpty()) {
          errors = errors.errors;
          var details = {};
      
          for(i = 0; i < errors.length; i++)
            details[errors[i].param + '_error'] = errors[i].msg;
            
            res.render('index', { title: 'Welcome to Kanau', details});            
        }
        else {
            userModel = mongoose.model('Client', User);

          //get values from login form
          var tempEmail = req.body.login_email_input;
          var tempPassword = req.body.login_password_input;
      
          userModel.findOne({Email: tempEmail})
            .then(result => {
              //if a match is found
              if(result) {
                
                bcrypt.compare(tempPassword, result.Password, function(err, result) {
                  if(result) {
                    let username = tempEmail;
                    console.log("Successfully logged in as " + username);
                    req.session.email = username;
                    res.redirect('/decks');
                  }
                  else {
                    console.log("invalid password");
                    res.redirect('/');
                  }
                })
              }
              else {//not yet done
                console.log("Email is not registered");
              }
            })
          
        }
    },

    chooseDecks: (req, res) => {
      res.render('deck-choose');
    },

    addPremadeDecks: (req, res) => {
        let newUser = req.session.email; // NEW ACCOUNT email here!!!!
        let premadeDecksCollection = "sampleuser@test.com";
        let chosenDecks = JSON.parse("[" + req.query.selectedDecks + "]"); // Chosen premade decks (decided for now...)
      
        let flashcardSchema = Flashcard.Flashcardschema(newUser);
        let DecksInfoSchema = Flashcard.DecksInfoSchema(newUser);
        let DeckSettingSchema = Flashcard.DeckSettingSchema(newUser)
      
        // Model for accessing premade decks
        let FlashcardCopyModel = flashcardConnection.model('flashcardCopy', flashcardSchema, premadeDecksCollection);
      
        // destination db model, use this to create documents and access save()
        let FlashcardDestinationModel = flashcardConnection.model('flashcardDestination', flashcardSchema, newUser);
        let DecksInfoCopyModel = flashcardConnection.model('decksInfoCopy', DecksInfoSchema, newUser);
        let DeckSettingCopyModel = flashcardConnection.model('deckSettingCopy', DeckSettingSchema, newUser);
      
        // PROCEED TO DUPLICATE DECKS!!!
        chosenDecks.forEach(chosenDeck => {
          console.log(chosenDeck + " adding...!");
          // Create Deck Setting per deck
          let deckSettingCopyDocument = new DeckSettingCopyModel({
            Tag: "Deck Settings",
            Deck: chosenDeck,
            MaxNew: 10, // default
            CurrentNew: 10,
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
                console.log(chosenDeck + ": " + i + "/" + trackProgressDeck + " duplicated.");
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
      
        res.send();
    },

    getAccountSettings: (req, res) => {
		// check if session expired (unauthorized access)
		if (req.session.email == null) {
			console.log("Session expired.");
			res.redirect('/');
		}

		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);

		let deckLength;

		flashcardModel.find()
		.then(flashcardResults => {
			deckLength = flashcardResults.length;
		})

        var info = {
          email: req.session.email,
          deckCount: deckLength // TODO
        }

        var details = {
          old_email_input_error: '',
          new_email_input_error: '',
          new_email_confirm_input_error: '',
          password_input_error: '',
          old_password_input_error: '',
          new_password_input_error: '',
          new_password_confirm_input_error: ''
        };
        res.render('account-settings', { title: 'Kanau | Account', info, details});
    },

    getAboutKanau: (req, res) => {
		// check if session expired (unauthorized access)
		if (req.session.email == null) {
			console.log("Session expired.");
			res.redirect('/');
		}
      
        res.render('about-kanau', { title: 'Kanau | About us'});
    },

    getBrowse: (req, res) => {
		var decksInfoSchema = Flashcard.DecksInfoSchema(req.session.email);
		let decksInfoModel = flashcardConnection.model('tag', decksInfoSchema, req.session.email);

		// check if session expired (unauthorized access)
		if (req.session.email == null) {
			console.log("Session expired.");
			res.redirect('/');
		}

        let deckNames;
      
        // get all deck names
        decksInfoModel.findOne({Tag: "Index"})
        .then(deckInfoResult => {
			deckNames = deckInfoResult.decks.slice();
			console.log(deckNames);
			res.render('browse-main', {title: 'Kanau | Browse', decks: deckNames});
        });
    },
    
    getDecks: (req, res) => {
		// check if session expired (unauthorized access)
		if (req.session.email == null) {
			console.log("Session expired.");
			res.redirect('/');
		}

		// Prepare models
		var decksInfoSchema = Flashcard.DecksInfoSchema(req.session.email);
		let decksInfoModel = flashcardConnection.model('tag', decksInfoSchema, req.session.email);
	
		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);
	
		var deckSettingSchema = Flashcard.DeckSettingSchema(req.session.email);
		let deckSettingModel = flashcardConnection.model('deck settings', deckSettingSchema, req.session.email);

    // No premade decks selected and has accessed decks page | All decks deleted
    decksInfoModel.findOne({Tag: "Index"})
    .then(decksInfoResult => {
      if (decksInfoResult == null || decksInfoResult.Deck.length == 0)
        res.redirect('/chooseDeck');
    });
        
		let _dueAndNewDecks = [] // 2D Array for storing new/review count [[due,new]]
    let trackDecks = []

		let currDate = new Date(new Date().toDateString());
        
		// Get decks
		console.log("Connecting...");
		decksInfoModel.find({Tag: "Index"}, 'decks') // Get deck names
		.then(decksInfoResults => {
		let personalDecks = decksInfoResults[0].decks.slice();
		console.log("THE DECK NAMES ARE: ");
		console.log(personalDecks);

    for (let i = 0; i < personalDecks.length; i++) {
      trackDecks.push(false);
      _dueAndNewDecks.push(null)
    }
	
		personalDecks.forEach( async (deck1, index1, array) => {
      let _due, _new; // track new/review count for each deck
      let deck = deck1
      let index = index1
			// Get deck settings (max reviews/new)
			await deckSettingModel.find({Tag: "Deck Settings", Deck: deck})
			.then(async deckSettingResult => {
			console.log("GET Deck preferences for " + deck);
			console.log(deckSettingResult[0]);
			

			// adjust new/review count based on actual decks returned after db query
			// get NEW count, limit on maximum new card setting OR current new count
			if (deckSettingResult[0].LastStudied == null) { // Deck that has not been studied ever
        let findFlashcards = async () => {
          flashcardModel.find({Deck: deck, ReviewDate: new Date("1970-01-01T00:00:01.000Z")})
          .limit(deckSettingResult[0].MaxNew)
          .then(newCountResult => {
          console.log("Deck - " + deck + " NOT studied.");
          if (newCountResult.length > deckSettingResult[0].MaxNew)
            _new = deckSettingResult[0].MaxNew;
          else 
            _new = newCountResult.length;
          })
        };

        findFlashcards();
			}
			else if (deckSettingResult[0].LastStudied.toISOString() == currDate.toISOString()) { // Deck studied on the same current day
        let findFlashcards = async () => {
          await flashcardModel.find({Deck: deck, ReviewDate: new Date("1970-01-01T00:00:01.000Z")})
          .limit(deckSettingResult[0].CurrentNew)
          .then(newCountResult => {
          console.log("Deck " + deck + " ready for REPEAT study session.");
          _new = newCountResult.length;
          })
        };

        findFlashcards();
			} else { // New Deck review day
        let findFlashcards = async () => {
          // new study session
          await flashcardModel.find({Deck: deck, ReviewDate: new Date("1970-01-01T00:00:01.000Z")})
          .limit(deckSettingResult[0].MaxNew)
          .then(newCountResult => {
          console.log("Deck " + deck + " ready for NEW study session.");
          if (newCountResult.length > deckSettingResult[0].MaxNew)
            _new = deckSettingResult[0].MaxNew;
            else 
            _new = newCountResult.length;
          })
        };

        findFlashcards();
			}
	
			// track new card count per deck
			await deckSettingModel.findOneAndUpdate({Tag: "Deck settings", Deck: deck}, {CurrentNew: _new}).exec();
			
			// Review card count, NO limit on maximum review count
			await flashcardModel.find({Deck: deck, ReviewDate: {"$lte": currDate, "$ne": new Date("1970-01-01T00:00:01.000Z")}})
			.then(reviewCountResult => {
				_due = reviewCountResult.length;
	
				_dueAndNewDecks[index] = [_due, _new];
        trackDecks[index] = true
        console.log("On deck: " + deck + "and index: " + index)
				console.log(_dueAndNewDecks + " [[due, new]] deck preference GOT!");
        
				if (trackDecks.every((trackDeck) => {return trackDeck == true})) {
          console.log(_dueAndNewDecks);
          res.render('decks-main', {decks: personalDecks, _dueAndNewDecks, title: 'Kanau | Decks'});
          console.log("RENDERED EJS");
				}
			});
			})
			.catch(err => console.log(err));
		})
		// TODO: No decks available
		// res.render('decks-main', {decks: personalDecks, _dueAndNewDecks: null, title: 'Kanau | Decks'});
		})
		.catch(err => console.log(err));
    },

    getDictionary: (req, res) => {
		// check if session expired (unauthorized access)
		if (req.session.email == null) {
			console.log("Session expired.");
			res.redirect('/');
		}
        console.log("Requested term: " + req.query.termQuery);
    
        // setup modal
        if (dictionaryModel == null) {
          let dictionarySchema = Dictionary;
          dictionaryModel = dictionaryConnection.model('dictionary', dictionarySchema, "Term Bank");
          console.log("Created Dictionary model.");
        }
    
        if (sentenceModel == null) {
          let sentenceSchema = Sentence;
          sentenceModel = dictionaryConnection.model('sentence', sentenceSchema, "Sentence Bank");
          console.log("Created Sentence model.")
        }
    
        if (sentenceTranslationModel == null) {
          let sentenceTranslationSchema = SentenceTranslation;
          sentenceTranslationModel = dictionaryConnection.model('sentence translation', sentenceTranslationSchema, "Sentence Translation Bank");
          console.log("Created Sentence translation model.");
        }
    
		var decksInfoSchema = Flashcard.DecksInfoSchema(req.session.email);
		let decksInfoModel = flashcardConnection.model('tag', decksInfoSchema, req.session.email);

        // Store deck names
        let deckNames;
    
        // Get deck names
        decksInfoModel.findOne({Tag: "Index"})
        .then(decksInfoResult => {
          deckNames = decksInfoResult.decks.slice();
        });
    
        // no term searched
        if (!req.query.termQuery) {
            res.render('dictionary.ejs', {Dictionary: null, isSearch: false, title: 'Kanau | About us'});
            res.end();
            return;
        }
    
        let termKanji = [];
        let termKana = [];
        let termMeaning = []; // 2D Array containing multiple meanings per term
    
        let tempMeanings = []
        let trackTermID = -1;
    
        dictionaryModel.find({Kanji: req.query.termQuery}).sort({TermID: 'asc'}).limit(2)
        .then(termResults => {
            termResults.forEach(termResult => {
                if (termResult.TermID != trackTermID) { // new term found
                    if (trackTermID != -1) { // append all recorded meanings
                        termMeaning.push(tempMeanings.slice()); // save all meanings from previous term
                        tempMeanings.length = 0;
                    }
                    trackTermID = termResult.TermID;
                    termKanji.push(termResult.Kanji);
                    termKana.push(termResult.Kana);
                    tempMeanings.push(termResult.Meaning);
                }
                else { // continue on to other meanings
                    tempMeanings.push(termResult.Meaning);
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
        })
        .then(termResults => {
          // Get sentences
          let sentences = [] // 2D Array containing multiple Japanese sentences per term
    
          termKanji.forEach((kanji, index) => {
            // find sentences for each term
            sentenceModel.find({Text: {"$regex": kanji, "$options": "i"}}).limit(2)
            .then(sentenceResults => {
              sentences.push(sentenceResults);
              
              if (index == termKanji.length - 1) {
                res.render('dictionary.ejs', {Dictionary: DictionaryResults, isSearch: true, Sentence: sentences, decks: deckNames, title: 'Kanau | About us'});
              }
            });
    
          });
    
        })
        .catch(error =>
            console.log(error));
    },

    getStudyDeck: (req, res) => {
        let currDate = new Date(new Date().toDateString());
        let _currentNew;
	
		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);
	
		var deckSettingSchema = Flashcard.DeckSettingSchema(req.session.email);
		let deckSettingModel = flashcardConnection.model('deck settings', deckSettingSchema, req.session.email);
      
        // new study session, update LastStudied and CurrentNew fields for tracking
        deckSettingModel.find({Tag: "Deck Settings", Deck: req.params.deck})
        .then(deckSettingResult => {
          // new study session
          if (currDate.toISOString() != deckSettingResult[0].LastStudied.toISOString()) {
            console.log("NEW study session!");
      
            // get "new" new count
            flashcardModel.find({Deck: req.params.deck, ReviewDate: new Date("1970-01-01T00:00:01.000Z")})
            .limit(deckSettingResult[0].MaxNew)
            .then(newCards => {
              _currentNew = newCards.length
              deckSettingModel.updateOne({Tag: "Deck Settings", Deck: req.params.deck}, {CurrentNew: _currentNew, LastStudied: currDate}).exec();
            });
          }
          res.render('study-session', {title: 'Kanau | Decks', deckName: req.params.deck});
        });
      
    },

    getStudyCards: (req, res) => {
        let deckName = req.query.deck;
        let cards = {
          newCards: [],
          reviewCards: []
        };
      
        let currDate = new Date(new Date().toDateString());
        console.log("Current date: " + currDate.toISOString());
	
		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);
	
		var deckSettingSchema = Flashcard.DeckSettingSchema(req.session.email);
		let deckSettingModel = flashcardConnection.model('deck settings', deckSettingSchema, req.session.email);
        
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
                console.log("GET New setting:" + deckSettingResult.CurrentNew);
                // proceed to add new cards
                newCards.forEach(newCard => {
                  cards.newCards.push(newCard);
                });
              }
              res.send(cards);
            });
      
          });
      
        });
      
    },

    postPassCard: (req, res) => {
        const card = JSON.parse(req.body.card);
      
        let currReviewDate = new Date(new Date().toDateString());
        let _currentNew;
	
		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);
	
		var deckSettingSchema = Flashcard.DeckSettingSchema(req.session.email);
		let deckSettingModel = flashcardConnection.model('deck settings', deckSettingSchema, req.session.email);
      
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
      
    },

    postFailCard: (req, res) => {
        const card = JSON.parse(req.body.card);
	
		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);
      
        flashcardModel.findByIdAndUpdate(card._id, {ReviewInterval: 1})
        .then(result => {
          res.send("(Fail) Resetted card review interval.");
          return;
        })
    },

    getFlashcardData: (req, res) => {
		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);

        flashcardModel.find({Tag: null}).then(flashcardResults => {
          console.log("Retrieved all flashcard data [NO FILTER]. Returning to view...");
          res.send(flashcardResults);
        });
    },

    getFlashcardDataFilter: (req, res) => {
		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);

        let newCardCheck = (req.query.newCard == "true");
        let reviewCardCheck = (req.query.reviewCard == "true");
      
        if (newCardCheck && reviewCardCheck) { // both checked
          flashcardModel.find({Deck : req.query.deck, Tag: null})
          .then(flashcardResults => {
            console.log("Filtered ALL.");
            res.send(flashcardResults);
            return;
          })
          .catch(err => console.log(err));
        }
      
        else if (newCardCheck && !reviewCardCheck) {// new card CHECKED
          flashcardModel.find({Deck : req.query.deck, ReviewDate: new Date("1970-01-01T00:00:01.000Z"), Tag: null})
          .then(flashcardResults => {
            console.log("Filtered to NEW cards.");
            res.send(flashcardResults);
            return;
          })
          .catch(err => console.log(err));
        }
      
        else if (reviewCardCheck && !newCardCheck) {// review card CHECKED
          flashcardModel.find({Deck : req.query.deck, ReviewDate: {"$ne": new Date("1970-01-01T00:00:01.000Z")}, Tag: null})
          .then(flashcardResults => {
            console.log("Filtered to REVIEW cards.");
            res.send(flashcardResults);
            return;
          })
          .catch(err => console.log(err));
        }
      
        else {
          console.log("Filtered to NONE (return empty).");
          res.send(null); // neither are checked
        }
      
    },

    postEditDeck: async (req, res) => {
      // prepare modal
      var decksInfoSchema = Flashcard.DecksInfoSchema(req.session.email);
      let decksInfoModel = flashcardConnection.model('tag', decksInfoSchema, req.session.email);

      var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
      let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);
    
      var deckSettingSchema = Flashcard.DeckSettingSchema(req.session.email);
      let deckSettingModel = flashcardConnection.model('deck settings', deckSettingSchema, req.session.email);
      
      let newDeckName = req.body.newDeck;
      let oldDeckName = req.body.oldDeck;
      let newCount = req.body.newCardCount;
    
      /*TODO save new deckname to:
        Flashcard: update every card to new deck name
        DecksInfo: update one array element (of decks) with new name
        DeckSettingSchema: update one with new deck name & MAX new card count
      */
    
      // [DecksInfo] Update decks info
      let decks = []; // store retrieved deck names, then update this
    
      await decksInfoModel.findOne({Tag: "Index"})
      .then(async decksInfoResult => {
        decks = decksInfoResult.decks.slice();
        
        // update with new name
        decks.some((deck, index) => {
          if (deck == oldDeckName) return decks[index] = newDeckName;
        });
    
        await decksInfoModel.updateOne({Tag: "Index"}, {decks: decks}).exec();
      })
      .catch(err => console.log(err)); 

      // [DeckSetting] Update deck settings
      let updatedCurrentNew;
      await deckSettingModel.findOne({Tag: "Deck Settings", Deck: oldDeckName})
      .then(deckSettingResult => {
        let CurrentNew = deckSettingResult.CurrentNew;
        updatedCurrentNew = (newCount < CurrentNew) ? newCount : CurrentNew
      });
      await deckSettingModel.updateOne({Tag: "Deck Settings", Deck: oldDeckName}, {Deck: newDeckName, MaxNew: newCount, CurrentNew: updatedCurrentNew}).exec()

      // [Flashcards] Update all flashcards associated with the original deckname
      await flashcardModel.updateMany({Tag: null, Deck: oldDeckName}, {Deck: newDeckName}).exec();
      console.log("Updated deck settings!");
      res.send(updatedCurrentNew.toString());
      
    },

    postAddCard: (req, res) => {
		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);
      
        const new_card = new flashcardModel({
          FrontWord: req.body.front,
          BackWord: req.body.back,
          Deck: req.body.deck,
          ReviewDate: "1970-01-01T00:00:01.000Z",
        });
      
        new_card.save();
        console.log("New card added to deck: " + new_card);
        res.status(200).send();
    },

    postEditCard: (req, res) => {
		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);

        let editCard = JSON.parse(req.body.card);
        let newFront = req.body.front;
        let newBack = req.body.back;
        let newDeck = req.body.deck;
      
        console.log(req.body);
      
        flashcardModel.findByIdAndUpdate(editCard._id, {FrontWord: newFront, BackWord: newBack, Deck: newDeck}).exec();
      
        res.send();
    },

    postDeleteCard: (req, res) => {
		var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
		let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);

        let deleteCard = JSON.parse(req.body.card);
      
        flashcardModel.findByIdAndDelete(deleteCard._id)
        .then(console.log("Deleted successfully."));
      
        res.send();
    },

    getEnglishTranslation: (req, res) => {
        let sentence = req.query.sentence;
        let meaningID;
      
        // Get meaning ID of the Japanese sentence
        sentenceModel.findOne({Text: sentence})
        .then(sentenceResult => {
          meaningID = sentenceResult.MeaningID;
        })
        .then(() => {
          // Get English translation
          sentenceTranslationModel.findOne({SentenceID: meaningID})
          .then(sentenceTranslationResult => {
            res.send(sentenceTranslationResult.Text);
          })
        })
        .catch(err => console.log(err));
    },

    getCheckCurrentEmail: (req,res) => {

      res.send(req.session.email);
    },
    postChangeEmail: (req, res) => {

      var errors = validationResult(req);
      var curr_email = req.session.email;
      var new_email = req.body.new_email_input;
      var curr_password = req.body.password_input;

      var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
      let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);

      let deckLength;

      var info = {
        email: curr_email,
        deckCount: deckLength // TODO
      }

      flashcardModel.find()
      .then(flashcardResults => {
        deckLength = flashcardResults.length;
      })


      if (!errors.isEmpty()) {
        errors = errors.errors;
        var details = {};
        
        for(i = 0; i < errors.length; i++) {
          details[errors[i].param + '_error'] = errors[i].msg;
          console.log(errors[i].param + '_error = ' + errors[i].msg);
        }
          res.render('account-settings', { title: 'Kanau | Account', info, details});            
      }
      else {

        userModel = mongoose.model('Client', User);
        userModel.findOne({Email: curr_email})
            .then(result => {
              //if a match is found
              if(result) {
                bcrypt.compare(curr_password, result.Password, function(err, result) {
                    if(result == true) {
                      userModel.updateOne({Email: curr_email}, {Email: new_email}).exec(); 
                      flashcardConnection.collection(curr_email).rename(new_email);
                      console.log("Email changed from: " + curr_email + " to: " + new_email);
                      res.redirect('/logout'); 
                    }
                    else {
                      console.log("invalid password");
                      res.redirect('/account'); 
                    }
                });
              }
              else {//not yet done
                console.log("Email is not registered");
              }
            });  
      }
    },

    postChangePassword: (req, res) => {

      var errors = validationResult(req);
      var curr_email = req.session.email;
      var old_password = req.body.old_password_input;
      var new_password = req.body.new_password_input;
      
      var flashcardSchema = Flashcard.Flashcardschema(req.session.email);
      let flashcardModel = flashcardConnection.model('flashcard', flashcardSchema, req.session.email);

      let deckLength;

      var info = {
        email: curr_email,
        deckCount: deckLength // TODO
      }

      flashcardModel.find()
      .then(flashcardResults => {
        deckLength = flashcardResults.length;
      })


      if (!errors.isEmpty()) {
        errors = errors.errors;
        var details = {};
        
        for(i = 0; i < errors.length; i++) {
          details[errors[i].param + '_error'] = errors[i].msg;
          console.log(errors[i].param + '_error = ' + errors[i].msg);
        }
          res.render('account-settings', { title: 'Kanau | Account', info, details});            
      }
      else {

        userModel = mongoose.model('Client', User);
        userModel.findOne({Email: curr_email})
            .then(result => {
              //if a match is found
              if(result) {

                bcrypt.compare(old_password, result.Password, function(err, result) {
                  if(result) {
                    
                    bcrypt.hash(new_password, 10, function(err, hash){
                      userModel.updateOne({Email: curr_email}, {Password: hash}).exec(); 
                      console.log("Password changed.");
                      res.redirect('/logout'); 
                    });

                  }
                  else {
                    console.log("invalid password");
                    res.redirect('/account'); 
                  }

                });

              }
              else {//not yet done
                console.log("Email is not registered");
              }
            });  
      }

    },

	  getLogout: async (req, res) => {
		await req.session.destroy(); // Deletes the session in the database.
		req.session = null // Deletes the cookie.
    console.log('Successfully logged out');
		res.redirect('/');
	  }

}

module.exports = controller;