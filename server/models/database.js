var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/port_city_defender';

var database = {};

var db = mongoose.connect(url);

database.connect = function() {
    return db;
};

console.log('database initialized');

module.exports = database;
