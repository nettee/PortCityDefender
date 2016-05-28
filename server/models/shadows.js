var mongoose = require('mongoose');
var database = require('./database');

var shadows = {};

var shadowSchema = new mongoose.Schema({
    id: String,
    password: String
});

var db = database.connect();

var Shadow = db.model('shadow', shadowSchema);

/**
 *
 * Create a shadow tuple in database
 * @param {String} id
 * @param {String} password
 * @param {Function(err)} callback
 */
shadows.create = function(id, password, callback) {
    var shadow = Shadow({'id': id, 'password': password});
    shadow.save(function(err, result) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

/**
 *
 * @param {String} id
 * @param {String} password
 * @param callback callback function, with one parameter: [result]
 */
shadows.checkPassword = function(id, password, callback) {
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
        Shadow.findOne({'id': id})
            .exec(
                // callback function
                function (err, shadow) {
                    if (err) {
                        callback({
                            status: "fail",
                            errorcode: 5,
                            error: "database error"
                        });
                        return;
                    }
                    if (shadow) {
                        console.log('shadow =', shadow);
                        if (shadow.password == password) {
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

module.exports = shadows;
