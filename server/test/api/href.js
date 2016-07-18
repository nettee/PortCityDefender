var url = require('url');
var request = require('request');

var href = {};

// uri.newUri = function(pathname, query) {
//     var obj = {};
//     obj.protocol = 'http';
//     obj.hostname = '121.40.97.40';
//     obj.port = 3000;
//     obj.pathname = pathname;
//     obj.query = query;
//     return url.format(obj);
// };

href.basic_auth = {
    'user': 'admin',
    'pass': 'admin',
    'sendImmediately': true
};

module.exports = href;
