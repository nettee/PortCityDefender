var mongoose = require('mongoose');
var database = require('./database');

var authentications = {};

var authenticationSchema = new mongoose.Schema({
    username: String,
    password: String
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

authentications.create = function (authentication, callback) {
    Authentication(authentication).save(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved', doc);
        }
        callback(err, authentications.sanitize(doc));
    });
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

authentications.update = function (username, updater, callback) {
    Authentication.findOneAndUpdate({'username': username}, updater, {new: true})
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, authentications.sanitize(doc));
            }
        });
};

module.exports = authentications;
