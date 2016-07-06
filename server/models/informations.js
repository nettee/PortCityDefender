var mongoose = require('mongoose');
var database = require('./database');

var db = database.connect();

var informationSchema = new mongoose.Schema({
    id: String,
    publisher: String,
    text: String,
    updated_time: Date,
    urgent: Boolean,
    images: [{
        id: String,
        size: Number,
        mime_type: String
    }],
    replications: [String]
}, {
    // specify collecion name in database
    collection: 'informations'
});

var headers = '-_id id publisher text urgent updated_time images replications';
var essentials = ['publisher', 'text', 'urgent'];

var Information = db.model('information', informationSchema);

/* automately set `updated_time`, `id`, `images`, `replications`
 * attribute before save a document
 */
Information.schema.pre('save', function(next) {
    this.updated_time = new Date;
    console.log('automately set updated_time to be', this.updated_time);
    next();
});

var informations = {};

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
    info.images = [];
    info.replications = [];
    Information(info).save(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved ', doc);
        }
        callback(err, {
            id: doc._id,
            publisher: doc.publisher,
            text: doc.text,
            urgent: doc.urgent,
            updated: doc.updated,
            images: doc.images,
            replications: doc.replications,
        });
    });
};

informations.addImageById = function(id, image, callback) {
    Information.findOne({'id': id}, function(err, doc) {
        doc.images.push(image);
        doc.markModified('images');
        doc.save(function(err) {
            callback(err);
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
        .exec(function(err, doc) {
            callback(err, doc.toObject());
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

//informations.update = function(id, updater, callback) {
//    console.log('updater =', updater);
//    Information.findOneAndUpdate({'id': id}, updater, {new: true})
////        .select(headers)
//        .exec(function(err, result) {
//            if (err) {
//                console.log(err);
//            }
//            callback(err, result);
//        });
//};

informations.deleteById = function(id, callback) {
    Information.remove({'id': id})
        .remove(function(err) {
            callback(err);
        });
};

module.exports = informations;
