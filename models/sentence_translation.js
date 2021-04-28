const mongoose = require('mongoose');
mongoose.pluralize(null);

const SentenceTranslationSchema = new mongoose.Schema({
    SentenceID: Number,
    Text: String
});

module.exports = SentenceTranslationSchema;