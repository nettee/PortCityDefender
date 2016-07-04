var mongoose = require('mongoose');
var database = require('./database');

var commandSchema = new mongoose.Schema({
    receiver: String,
    sender: String,
    content: String
}, {
    // specify collection name in database
    collection: 'commands'
});

var db = database.connect();

var Command = db.model('command', commandSchema);

exports.read = function(condition, callback) {
    console.log('condition =', condition);
    Command.find(condition)
        // force key _id not to appear
        .select('-_id receiver sender content')
        .exec(function(err, commandList) {
            if (err) {
                console.log(err);
            }
            callback(err, commandList);
        });
};

