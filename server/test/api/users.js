var url = require('url');
var request = require('request');

var users = {};

function newUrlObject(pathname, query) {
    var obj = {};
    obj.protocol = 'http';
    obj.hostname = '121.40.97.40';
    obj.port = 3000;
    obj.pathname = pathname;
    obj.query = query;
    return obj;
}

users.getUserList = function(callback) {
    var urlObject = newUrlObject('/users');
    var uri = url.format(urlObject);
    request.get(uri, function(err, response, body) {
        if (err) {
            throw new Error(err);
        }
        if (response.statusCode != 200) {
            throw new Error(response.statusCode);
        }
        var users = JSON.parse(body);
        callback(users);
    });
};

module.exports = users;
