var express = require('express');
var router = express.Router();
var users = require('../models/users');

// GET users list
router.get('/', function (req, res) {
    var query = req.query;
    if (query.id) {
        var filter = function (user) {
            return user.id == query.id;
        };
    } else if (query.name) {
        var filter = function (user) {
            return user.name == query.name;
        };
    } else if (query.level) {
        var filter = function (user) {
            return user.level == query.level;
        };
    } else if (query.region) {
        var filter = function (user) {
            return user.region == query.region;
        };
    } else {
        var filter = function (user) {
            return true;
        };
    }
    users.find(filter, function(err, list) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(list);
        }
    });
});

// POST new user
router.post('/', function(req, res) {
    var user = req.body;
    users.create(user, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(user);
        }
    });
});

// MODIFY user information
router.put('/:id', function(req, res) {
    var id = req.params.id;
    var user = req.body;
    users.updateById(id, user, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(user);
        }
    });
});

// DELETE user
router.delete('/:id', function(req, res) {
    var id = req.params.id;
    users.deleteById(id, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(204).send({});
        }
    });
});

module.exports = router;
