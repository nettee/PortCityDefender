var mongoose = require('mongoose');
var database = require('./database');

var db = database.connect();

var imageSchema = new mongoose.Schema({
    id: String,
    size: Number,
    mime_type: String,
}, {
    // specify collection name in database
    collection: 'images'
});

var Image = db.model('image', imageSchema);

Image.schema.pre('save', function(next) {
    this.id = this._id;
    next();
});

var headers = '-_id id size mime_type';

var images = {};

images.create = function(image, callback) {
    Image(image).save(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved', doc);
        }
        callback(err, {
            id: doc.id,
            size: doc.size,
            mime_type: doc.mime_type
        });
    });
};

module.exports = images;
