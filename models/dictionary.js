const mongoose = require('mongoose');
mongoose.pluralize(null);

const DictionarySchema = new mongoose.Schema({
    TermID: Number,
    Kanji: String,
    isCommonKanji: String,
    Kana: String,
    Meaning: String
});

module.exports = DictionarySchema;