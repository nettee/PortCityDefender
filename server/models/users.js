var mongoose = require('mongoose');
var database = require('./database');

var users = {};

var userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    level: Number,
    region: String,
    description: String,
    phone: String
});

var db = database.connect();

var User = db.model('user', userSchema);

/**
 *
 * Create an user tuple in database
 * @param {Object} user
 * @param {Function(err)} callback
 */
users.create = function(user, callback) {
    if (!user.id 
            || !user.name 
            || !user.level
            || !user.region 
            || !user.description 
            || !user.phone) {
        // user information is not complete
        callback("user information not complete", 400);
        return;
    }
    User(user).save(function(err, result) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log('saved', result);
            callback(null);
        }
    });
};

/**
 *
 * Read list of users from database
 * @param {Object} user
 * @param {Function(err, userlist)} callback
 *
 */
users.find = function(filter, callback) {
    User.find().exec(function(err, userlist) {
        if (err) {
            console.log(err);
            callback(err, []);
        } else {
            callback(null, userlist.filter(filter));
        }
    });
};

/**
 * Update user tuple with given id
 * @param {Number} id
 * @param {Object} newUser
 * @param {Function(err)} callback
 *
 */
users.updateById = function(id, newUser, callback) {
    User.where({'id': id})
        .update(newUser)
        .exec(function(err, result) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log(result);
                callback(null);
            }
        });
};

/**
 * Delete user tuple with given id
 * @param {Number} id
 * @param {Function(err)} callback
 *
 */
users.deleteById = function(id, callback) {
    User.remove({'id': id})
        .remove(function(err, result) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log(result);
                callback(null);
            }
        });
};

module.exports = users;
