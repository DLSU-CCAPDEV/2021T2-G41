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

    FlashcardInfoSchema : function(username) {
        const FlashcardInfoSchema = new mongoose.Schema({
            Tag: String,
            decks: Object
        });

        return FlashcardInfoSchema;
    }
}

module.exports = getSchema;