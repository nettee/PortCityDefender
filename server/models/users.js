var mongoose = require('mongoose');
var database = require('./database');

var users = {};

var userSchema = new mongoose.Schema({
    id: String,
    password: String,
    name: String,
    level: Number,
    region: String,
    description: String,
    phone: String
}, {
    collection: 'users' // specify collection name in database
});

var db = database.connect();

var User = db.model('users', userSchema);

users.isCompleteUser = function(user) {
    return !!user.id 
        && !!user.name 
        && !!user.level
        && !!user.region 
        && !!user.description 
        && !!user.phone;
};

users.sanitize = function(user) {
    return {
        id: user.id,
        name: user.name,
        level: user.level,
        region: user.region,
        description: user.description,
        phone: user.phone,
    };
};

/**
 * Read one user tuple from database
 * @param {String} id
 * @param {Function} callback
 *
 * callback signature: function callback(err, user)
 */
users.readOne = function(id, callback) {
    User.where({'id': id})
        .findOne()
        .select('-_id id name level region description phone') 
        .exec(function (err, result) {
            callback(err, result);
        });
}

/*
 * used by same level
 */
users.readOneWithId = function(id, callback) {
    User.where({'id': id})
        .findOne()
        .exec(function (err, doc) {
            callback(err, doc);
        });
}

/**
 *
 * Create an user tuple in database
 * @param {Object} user
 * @param {Function} callback
 *
 * callback signature: function callback(err)
 */
users.create = function(user, callback) {
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
 * @param {Object} condition
 * @param {Function} callback
 *
 * callback signature: function callback(err, userlist)
 *
 */
function read(condition, callback) {
    console.log('condition =', condition);
    User.find(condition)
        .select('-_id id name level region description phone')  // remove key '_id'
        .exec(function(err, userlist) {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                callback(null, userlist);
            }
        });
};

users.exists = function(condition, callback) {
    User.findOne(condition)
        .exec(function(err, result) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(err, !!result);
            }
        });
};

users.existsId = function(id, callback) {
    users.exists({'id': id}, function(err, result) {
        callback(err, result);
    });
};

/**
 * Update user tuple with given id
 * @param {String} id
 * @param {Object} updater
 * @param {Function(err)} callback
 *
 */
function update(id, updater, callback) {
    delete updater.id; // ensure id not to be updated
    User.findOneAndUpdate({'id': id}, updater, {new: true})
        .select('-_id id name level region description phone')
        .exec(function(err, result) {
            // result: user after updating
            if (err) {
                console.log(err);
                callback(err, {});
            } else {
                callback(null, result);
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
        .remove(function(err) {
            callback(err);
        });
};

/**
 *
 * @param {String} id
 * @param {String} password
 * @param callback callback function, with one parameter: [result]
 */
users.checkPassword = function(id, password, callback) {
    if (!id || id == '') {
        callback({
            status: "fail",
            errorcode: 1,
            error: "empty id"
        });
    } else if (!password || password == '') {
        callback({
            status: "fail",
            errorcode: 2,
            error: "empty password"
        });
    } else {
        // find in 'users' collection
        User.findOne({'id': id})
            .select('-_id password')
            .exec(function (err, user) {
                if (err) {
                    callback({
                        status: "fail",
                        errorcode: 5,
                        error: "database error"
                    });
                    return;
                }
                if (user) {
                    if (user.password == password) {
                        callback({
                            status: "pass",
                            errorcode: 0,
                            error: ""
                        });
                    } else {
                        callback({
                            status: "fail",
                            errorcode: 4,
                            error: "wrong password"
                        });
                    }
                } else {
                    console.log('user ID not exist');
                    callback({
                        status: "fail",
                        errorcode: 3,
                        error: "user ID does not exist"
                    });
                }
            }
        );
    }
};

users.update = update;
users.read = read;

module.exports = users;
