var mongoose = require('mongoose');
var database = require('./database');

var authentications = {};

var authenticationSchema = new mongoose.Schema({
    username: String,
    password: String,
}, {
    collection: 'authentications' // specify collection name in database
});

var db = database.connect();

var Authentication = db.model('authentications', authenticationSchema);

authentications.sanitize = function (authentication) {
    if (!authentication) {
        return null;
    }
    return {
        username: authentication.username,
        password: authentication.password
    };
};

/**
 * Read one authentication tuple from database
 * @param {String} username
 * @param {Function} callback
 *
 * callback signature: function callback(err, authentication)
 */
authentications.readOne = function(username, callback) {
    Authentication.where({'username': username})
        .findOne()
        .exec(function (err, doc) {
            callback(err, authentications.sanitize(doc));
        });
};

module.exports = authentications;
