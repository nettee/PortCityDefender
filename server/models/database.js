var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/port_city_defender';

var database = {};

var db = mongoose.connect(url);

database.connect = function() {
    return db;
};

//var userSchema = new mongoose.Schema({
//    username: String,
//    password: String
//});
//
///* this model will correspond to 'users' collection
// * in MongoDB database
// */
//var User = db.model('user', userSchema);
//
///**
// *
// * @param {String} username
// * @param {String} password
// * @param callback callback function, with one parameter: [result]
// */
//database.checkPassword = function(username, password, callback) {
//    if (!username || username == '') {
//        callback({
//            status: "fail",
//            errorcode: 1,
//            errortext: "empty username"
//        });
//    } else if (!password || password == '') {
//        callback({
//            status: "fail",
//            errorcode: 2,
//            errortext: "empty password"
//        });
//    } else {
//        // find in 'users' collection
//        User.findOne()
//            .where('username').equals(username)
//            .select('username password')
//            .exec(
//                // callback function
//                function (err, user) {
//                    if (err) {
//                        callback({
//                            status: "fail",
//                            errorcode: 5,
//                            errortext: "database error"
//                        });
//                        return;
//                    }
//                    if (user) {
//                        console.log('user =', user);
//                        if (user.password == password) {
//                            callback({
//                                status: "pass",
//                                errorcode: 0,
//                                errortext: ""
//                            });
//                        } else {
//                            callback({
//                                status: "fail",
//                                errorcode: 4,
//                                errortext: "wrong password"
//                            });
//                        }
//                    } else {
//                        console.log('user does not exist');
//                        callback({
//                            status: "fail",
//                            errorcode: 3,
//                            errortext: "user does not exist"
//                        });
//                    }
//                }
//            );
//    }
//};

console.log('database initialized');

module.exports = database;
