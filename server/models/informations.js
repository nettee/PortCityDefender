var mongoose = require('mongoose');
var database = require('./database');

var informations = {};

var informationSchema = new mongoose.Schema({
    id: String,
    publisher: String,
    text: String,
    images: [String],
    urgent: Boolean,
    replications: [{
        publisher: String,
        content: String
    }]
});

var db = database.connect();

var Information = db.model('information', informationSchema);

/* Create an information object in database
 * @param {Object} info
 * @param {Function} callback
 *
 * callback signature: function callback(err)
 */
informations.create = function(info, callback) {
    Information(info).save(function(err, result) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log('saved', result);
            callback(null);
        }
    });
};

module.exports = informations;
