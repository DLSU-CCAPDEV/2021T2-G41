const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// get models
const Dictionary = require('./models/dictionary');

// express app
const app = express();
const dictionaryURI = "mongodb+srv://dbAdmin:admin123@kanaugcp.tm0gd.mongodb.net/Dictionary?retryWrites=true&w=majority";

// register view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/html')); // FIX for Failed to lookup view error

mongoose.connect(dictionaryURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(app.listen(3000))
    .catch(function(error) {
        console.log(error);
    });

// make client-side scripts accessible (This is the FIX for the text only problem)
app.use(express.static('src'));
app.use('/img', express.static('./img'));

// takes url encoded data and parse it into an object usable from a req object
app.use(express.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.render('dictionary.ejs', {Dictionary: null, isSearch: false});
});

app.post('/dictionary.html', function(req, res) {
    console.log("Requested term: " + req.body.termQuery);
    if (!req.body.termQuery)
        res.render('dictionary.ejs', {Dictionary: null, isSearch: false});
    Dictionary.find({Kanji: {"$regex": req.body.termQuery, "$options": "i"} }).sort({TermID: 'asc'})
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
        res.render('dictionary.ejs', {Dictionary: DictionaryResults, isSearch: true});
    })
    .catch(error =>
        console.log(error))
});