var express = require('express');
var router = express.Router();
var users = require('../models/users');

// GET users list
router.get('/', function (req, res) {
    var query = req.query;
    if (query.id) {
        res.send('get user by id.');
    } else if (query.name) {
        res.send('get user by name.');
    } else if (query.level) {
        res.send('get user by level.');
    } else if (query.region) {
        res.send('get user by region.');
    } else {
        res.send('It seems that you are trying to get users list.');
    }
});

// POST new user
router.post('/', function(req, res) {
    var user = req.body;
    users.create(user, function(err, status) {
        if (err) {
            res.status(status).send(err);
        } else {
            res.status(201).send(user);
        }
    });
});

// MODIFY user information
router.put('/', function(req, res) {
    res.send('It seems that you are trying to modify user');
});

// DELETE user
router.delete('/', function(req, res) {
    res.send('It seems that you are trying to delete user');
});

module.exports = router;
