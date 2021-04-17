var userName = undefined;
const mongoose = require('mongoose');
mongoose.pluralize(null);

var FlashcardModel = null;

var getSchema = {
    Flashcardschema : function(username) {
        const FlashcardSchema = new mongoose.Schema({
            FrontWord: String,
            BackWord: String,
            Deck: String,
            ReviewDate: Date
        });

        return FlashcardSchema;
    },

    // Contains all decks of a user
    FlashcardInfoSchema : function(username) {
        const FlashcardInfoSchema = new mongoose.Schema({
            Tag: String, // Index
            decks: Object
        });

        return FlashcardInfoSchema;
    },

    // Get preferences for a deck created by a user
    DeckSettingSchema : function(username) {
        const DeckSettingSchema = new mongoose.Schema({
            Tag: String, // Deck Settings
            Deck: String,
            MaxReviews: Number,
            MaxNew: Number
        });

        return DeckSettingSchema;
    }

}

module.exports = getSchema;