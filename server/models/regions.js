var mongoose = require('mongoose');
var database = require('./database');

var regionList = [
    '东北',
    '东南',
    '西南',
    '西北'
];

var regions = {};

/**
 *
 * Read list of regions from database
 * @param {Function} callback
 *
 * callback signature: function callback(err, regionList)
 */
regions.read = function read(callback) {
    callback(null, regionList);
}

regions.contains = function contains(name, callback) {
    for (var i = 0; i < regionList.length; i++) {
        if (regionList[i] == name) {
            callback(null, true);
            return;
        }
    }
    callback(null, false);
}

regions.create = function create(name, callback) {
    regionList.push(name);
    console.log(regionList);
    callback(null, name);
}

regions.delete = function delete_(name, callback) {
    for (var i = 0; i < regionList.length; i++) {
        if (regionList[i] == name) {
            regionList.splice(i, 1); // delete array element
            callback(null);
            return;
        }
    }
    callback('region name does not exist');
}

module.exports = regions;
