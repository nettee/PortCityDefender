var mongoose = require('mongoose');
var database = require('./database');
var users = require('./users');
var images = require('./images');

var db = database.connect();

var informationSchema = new mongoose.Schema({
    id: String,
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    text: String,
    updated_time: Date,
    urgent: Boolean,
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'images'
    }],
    replications: [{
        replier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        content: String
    }]
}, {
    // specify collection name in database
    collection: 'informations'
});

var headers = '-_id id publisher text urgent updated_time images replications';
var essentials = ['publisher', 'text', 'urgent'];
2
var Information = db.model('informations', informationSchema);

/* automate set `updated_time`, `id`, `images`, `replications`
 * attribute before save a document
 */
Information.schema.pre('save', function(next) {
    this.updated_time = new Date;
    console.log('automately set updated_time to be', this.updated_time);
    next();
});

var informations = {};

informations.sanitize = function(info) {
    return {
        id: info._id,
        publisher: users.sanitize(info.publisher),
//        publisher: info.publisher,
        text: info.text,
        urgent: info.urgent,
        updated_time: info.updated_time,
        images: info.images.map(images.sanitize),
        replications: info.replications.map(function (replication) {
            return {
                replier: users.sanitize(replication.replier),
                content: replication.content
            }
        })
    };
};

informations.hasEssentials = function(info) {
    for (var i = 0; i < essentials.length; i++) {
        var e = essentials[i];
        if (!info.hasOwnProperty(e)) {
            return false;
        }
    }
    return true;
};

/* Create an information object in database
 * @param {Object} info
 *     @attr {String} publisher - publisher id
 *     @attr {String} text
 *     @attr urgent
 * @param {Function} callback
 *
 * callback signature:
 * @param err
 * @param {Object} result - complete Information object
 */
informations.create = function(info, callback) {
    console.log('info =', info);
    users.readOneWithId(info.publisher, function(err, publisher) {
        if (err) {
            return callback(err, null);
        }
        console.log('publisher._id =', publisher._id);
        Information({
            publisher: publisher._id,
            text: info.text,
            urgent: info.urgent,
            images: [],
            replications: [],
        }).save(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log('saved ', doc);
            }
            doc.populate('publisher images', function(err, pdoc) {
                callback(err, informations.sanitize(pdoc));
            });
        });
    });
};

informations.addImageById = function(_id, image_id, callback) {
    Information.findOne({'_id': _id}, function(err, doc) {
        if (err) {
            return callback(err);
        }
        doc.images.push(image_id);
        doc.markModified('images');
        doc.save(function(err) {
            callback(err);
        });
    });
};

informations.addReplicationById = function(_id, replication, callback) {
    Information.findOne({'_id': _id}, function(err, doc) {
        if (err) {
            return callback(err);
        }
        users.readOneWithId(replication.replier, function (err, replier) {
            if (err) {
                return callback(err);
            }
            console.log('replier._id =', replier._id);
            doc.replications.push({
                replier: replier._id,
                content: replication.content
            });
            doc.markModified('replications');
            doc.save(function (err) {
                callback(err);
            });
        });
    });
};

informations.read = function(condition, callback) {
    console.log('condition =', condition);
    Information.find()
        .sort({'updated_time': -1})
        .populate([
            {path: 'publisher'},
            {path: 'images'},
            {path: 'replications.replier'}
        ]) 
        .exec(function(err, docs) {
            console.log('docs =', docs);
            if (err) {
                console.log(err);
            }
            var result = docs.map(informations.sanitize);
            callback(err, result);
        });
};

informations.readOne = function(_id, callback) {
    Information.where({'_id': _id})
        .findOne()
        .populate([
            {path: 'publisher'},
            {path: 'images'},
            {path: 'replications.replier'}
        ]) 
        .exec(function(err, doc) {
            callback(err, informations.sanitize(doc));
        });
};

informations.exists = function(condition, callback) {
    Information.findOne(condition)
        .exec(function(err, result) {
            callback(err, result);
        });
};

informations.existsId = function(_id, callback) {
    informations.exists({'_id': _id}, function(err, result) {
        callback(err, result);
    });
};

informations.deleteById = function(_id, callback) {
    Information.remove({'_id': _id})
        .remove(function(err) {
            callback(err);
        });
};

module.exports = informations;
