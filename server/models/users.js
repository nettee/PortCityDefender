var mongoose = require('mongoose');

var users = {};

/**
 *
 * @param {Object} user
 * @param {Function} callback
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
    callback(null, 201);
};

module.exports = users;
