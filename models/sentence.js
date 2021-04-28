const mongoose = require('mongoose');
mongoose.pluralize(null);

const SentenceSchema = new mongoose.Schema({
    SentenceID: Number,
    MeaningID: Number,
    Text: String
});

module.exports = SentenceSchema;