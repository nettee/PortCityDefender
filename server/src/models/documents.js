var mongoose = require('mongoose');
var database = require('./database');
var users = require('./users');
var images = require('./images');

var db = database.connect();

var documentSchema = new mongoose.Schema({
    'class': String,
    subclass: String,
    title: String,
    text: String,
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'images'
    }]
}, {
    // specify collection name in database
    collection: 'documents'
});

// var headers = '-_id id publisher text urgent updated_time images replications';
var essentials = ['class', 'subclass', 'title', 'text', 'images'];

var Document = db.model('documents', documentSchema);

// /* automate set `updated_time`, `id`, `images`, `replications`
//  * attribute before save a document
//  */
// Information.schema.pre('save', function(next) {
//     this.updated_time = new Date;
//     console.log('automately set updated_time to be', this.updated_time);
//     next();
// });

var documents = {};

documents.sanitize = function(document) {
    return {
        id: document._id,
        class: document.class,
        subclass: document.subclass,
        title: document.title,
        text: document.text,
        images: document.images.map(function (image) {
            return images.sanitize(image);
        })
    };
};

documents.hasEssentials = function(info) {
    for (var i = 0; i < essentials.length; i++) {
        var e = essentials[i];
        if (!info.hasOwnProperty(e)) {
            return false;
        }
    }
    return true;
};

documents.create = function(document, callback) {
    console.log('document =', document);
        Document(document).save(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log('saved ', doc);
            }
            callback(err, documents.sanitize(doc));
        });
};

// informations.addImageById = function(_id, image_id, callback) {
//     Information.findOne({'_id': _id}, function(err, doc) {
//         if (err) {
//             return callback(err);
//         }
//         doc.images.push(image_id);
//         doc.markModified('images');
//         doc.save(function(err) {
//             callback(err);
//         });
//     });
// };
//
// informations.addReplicationById = function(_id, replication, callback) {
//     Information.findOne({'_id': _id}, function(err, doc) {
//         if (err) {
//             return callback(err);
//         }
//         users.readOneWithId(replication.replier, function (err, replier) {
//             if (err) {
//                 return callback(err);
//             }
//             console.log('replier._id =', replier._id);
//             doc.replications.push({
//                 replier: replier._id,
//                 content: replication.content
//             });
//             doc.markModified('replications');
//             doc.save(function (err) {
//                 callback(err);
//             });
//         });
//     });
// };

documents.read = function(condition, callback) {
    Document.find(condition)
        .populate(
            {path: 'images'}
        )
        .exec(function (err, docs) {
            if (err) {
                console.log(err);
            }
            var result = docs.map(documents.sanitize);
            callback(err, result);
        });
};

documents.readOne = function(_id, callback) {
    Document.where({'_id': _id})
        .populate(
            {path: 'images'}
        )
        .findOne()
        .exec(function(err, doc) {
            callback(err, documents.sanitize(doc));
        });
};

documents.exists = function(condition, callback) {
    Document.findOne(condition)
        .exec(function(err, result) {
            callback(err, result);
        });
};

documents.existsId = function(_id, callback) {
    documents.exists({'_id': _id}, function(err, result) {
        callback(err, result);
    });
};

documents.update = function(_id, updater, callback) {
    Document.findOneAndUpdate({'_id': _id}, updater, {new: true})
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
                callback(err, {});
            } else {
                callback(null, documents.sanitize(doc));
            }
        });
};

documents.deleteById = function(_id, callback) {
    Document.remove({'_id': _id})
        .remove(function(err) {
            callback(err);
        });
};

module.exports = documents;
