var mongoose = require('mongoose');
var database = require('./database');

var informations = {};

var informationSchema = new mongoose.Schema({
    id: String,
    publisher: String,
    text: String,
    updated: Date,
    urgent: Boolean,
    images: [String]
}, {
    // specify collecion name in database
    collection: 'informations'
});

var db = database.connect();

var Information = db.model('information', informationSchema);

// automately set `updated` attribute before save a document
Information.schema.pre('save', function(next) {
    this.updated = new Date;
    console.log('automately set updated to be', this.updated);
    next();
});

informations.read = function(condition, callback) {
    console.log('condition =', condition);
    Information.find(condition)
        // force key _id not to appear
        .select('-_id id publisher text images urgent updated') 
        .exec(function(err, infolist) {
            if (err) {
                console.log(err);
            }
            callback(null, infolist);
        });
};

/* Create an information object in database
 * @param {Object} info
 * @param {Function} callback
 *
 * callback signature: function callback(err)
 */
informations.create = function(info, callback) {
    Information(info).save(info, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved ', doc);
        }
        callback(err, {
            id: doc.id,
            publisher: doc.publisher,
            text: doc.text,
            updated: doc.updated,
            urgent: doc.urgent,
            images: doc.images,
        });
    });
};

module.exports = informations;
