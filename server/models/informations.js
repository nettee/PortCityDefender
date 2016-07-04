var mongoose = require('mongoose');
var database = require('./database');

var informations = {};

var informationSchema = new mongoose.Schema({
    id: String,
    publisher: String,
    text: String,
    updated: Date,
    urgent: Boolean,
    images: [String],
    replications: [String],
}, {
    // specify collecion name in database
    collection: 'informations'
});

var headers = '-_id id publisher text urgent updated images replications';
var essentials = ['publisher', 'text', 'urgent'];

var db = database.connect();

var Information = db.model('information', informationSchema);

/* automately set `updated`, `id`, `images`, `replications`
 * attribute before save a document
 */
Information.schema.pre('save', function(next) {
    this.updated = new Date;
    console.log('automately set updated to be', this.updated);
    this.id = this._id;
    console.log('automately set id to be', this.id);
    this.images = [];
    this.replications = [];
    next();
});

informations.hasEssentials = function(info) {
    console.log(info);
    console.log('publisher' in info);
    for (var e of essentials) {
        if (!info.hasOwnProperty(e)) {
            return false;
        }
    }
    return true;
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
            urgent: doc.urgent,
            updated: doc.updated,
            images: doc.images,
            replications: doc.replications,
        });
    });
};

informations.read = function(condition, callback) {
    console.log('condition =', condition);
    Information.find(condition)
        // force key _id not to appear
        .select(headers) 
        .exec(function(err, infolist) {
            if (err) {
                console.log(err);
            }
            callback(null, infolist);
        });
};

informations.readOne = function(id, callback) {
    Information.where({'id': id})
        .findOne()
        .select(headers)
        .exec(function(err, result) {
            callback(err, result);
        });
};

informations.exists = function(condition, callback) {
    Information.findOne(condition)
        .exec(function(err, result) {
            callback(err, result);
        });
};

informations.existsId = function(id, callback) {
    informations.exists({'id': id}, function(err, result) {
        callback(err, result);
    });
};

informations.deleteById = function(id, callback) {
    Information.remove({'id': id})
        .remove(function(err) {
            callback(err);
        });
};

module.exports = informations;
