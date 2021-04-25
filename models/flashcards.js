var userName = undefined;
const mongoose = require('mongoose');
mongoose.pluralize(null);

var FlashcardModel = null;

var getSchema = {
    // Data for a flashcard
    Flashcardschema : function(username) {
        const FlashcardSchema = new mongoose.Schema({
            FrontWord: String,
            BackWord: String,
            Deck: String,
            ReviewDate: Date, // date the card will be due for review | 1970-01-01T00:00:01.000Z if not yet studied
            ReviewInterval: Number // how much DAYS to move add to the ReviewDate (pass)
        });

        return FlashcardSchema;
    },

    // What decks does the user have?
    DecksInfoSchema : function(username) {
        const DecksInfoSchema = new mongoose.Schema({
            Tag: String, // Index
            decks: Object // Array of deck names
        });

        return DecksInfoSchema;
    },

    // Get preferences for a deck created by a user
    DeckSettingSchema : function(username) {
        const DeckSettingSchema = new mongoose.Schema({
            Tag: String, // Deck Settings
            Deck: String,
            MaxReviews: Number,
            MaxNew: Number,

            CurrentNew: Number, // keep track of new cards already studied per day
            LastStudied: Date

        });

        return DeckSettingSchema;
    }

}

module.exports = getSchema;