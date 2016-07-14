var mongoose = require('mongoose');
var database = require('./database');

var shadows = {};

var shadowSchema = new mongoose.Schema({
    id: String,
    password: String
});

var db = database.connect();

var Shadow = db.model('shadow', shadowSchema);

/**
 *
 * Create a shadow tuple in database
 * @param {String} id
 * @param {String} password
 * @param {Function(err)} callback
 */
shadows.create = function(id, password, callback) {
    var shadow = Shadow({'id': id, 'password': password});
    shadow.save(function(err, result) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null);
        }
    });
};


module.exports = shadows;
