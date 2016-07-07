var mongoose = require('mongoose');
var database = require('./database');
var users = require('./users');

var db = database.connect();

var commandSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    content: String,
    updated_time: Date,
}, {
    // specify collection name in database
    collection: 'commands'
});

var headers = '_id receiver sender content updated_time';

var Command = db.model('command', commandSchema);

Command.schema.pre('save', function(next) {
    this.updated_time = new Date;
    console.log('automately set updated_time to be', this.updated_time);
    next();
});

var commands = {};

commands.sanitize = function(command) {
    if (!command) {
        return command;
    }
    return {
        receiver: users.sanitize(command.receiver),
        sender: users.sanitize(command.sender),
        content: command.content,
        updated_time: command.updated_time,
    };
};

/* Create a command object in database
 * @param {Object} command
 *     @attr receiver: an id of User object
 *     @attr sender: an id of User object
 *     @attr content: {String} 
 * @param {Function} callback
 *
 * callback signature: 
 * @param err
 * @param {Object} result - complete Command object
 */
commands.create = function(command, callback) {
    console.log('command =', command);
    users.readOneWithId(command.receiver, function(err, receiver) {
        if (err) {
            return callback(err, null);
        }
        users.readOneWithId(command.sender, function(err, sender) {
            if (err) {
                return callback(err, null);
            }
            console.log('receiver._id =', receiver._id);
            console.log('sender._id =', sender._id);
            Command({
                receiver: receiver._id,
                sender: sender._id,
                content: command.content
            }).save(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('saved', doc);
                }
                callback(err, commands.sanitize(doc));
            });
        });
    });
};


commands.read = function(callback) {
    Command.find()
        .populate('receiver sender') // association query
        .select(headers)
        .exec(function(err, docs) {
            if (err) {
                console.log(err);
            }
            var result = docs.map(commands.sanitize);
            callback(err, result);
        });
};

commands.readByReceiver = function(receiver, callback) {
    commands.read(function(err, command_list) {
        if (err) {
            callback(err, command_list);
        } else {
            var result = command_list.filter(function(command) {
                return command.receiver.id == receiver;
            });
            callback(err, result);
        }
    });
};
    

module.exports = commands;
