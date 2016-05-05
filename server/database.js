var mongoose = require('mongoose');

var dbUrl = 'mongodb://localhost/port_city_defender';

var database = {};

var db = mongoose.connect(dbUrl);

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

/* this model will correspond to 'users' collection
 * in MongoDB database
 */
var User = db.model('user', userSchema);

/**
 * Check username and password, send it back to http response
 * @param {Object} res HTTP response object
 * @param {String} username
 * @param {String} password
 */
database.checkPassword = function (res, username, password) {
    if (!username || username == '') {
        res.send({status: "fail", error: "empty username"});
    } else if (!password || password == '') {
        res.send({status: "fail", error: "empty password"});
    } else {
        // find in 'users' collection
        User.findOne()
            .where('username').equals(username)
            .select('username password')
            .exec(
                // callback function
                function (err, user) {
                    if (err) {
                        res.send({status: "fail", error: "database error"})
                        return;
                    }
                    if (user) {
                        console.log('user =', user);
                        if (user.password == password) {
                            res.send({status: "pass", error: ""});
                        } else {
                            res.send({status: "fail", error: "wrong password"});
                        }
                    } else {
                        console.log('user does not exist');
                        res.send({status: "fail", error: "user does not exist"});
                    }
                }
            );
    }
};

console.log('database initialized');

module.exports = database;