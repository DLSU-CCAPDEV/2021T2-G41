var mongoose = require('mongoose');
mongoose.pluralize(null);

var UserSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }
});

module.exports = UserSchema;