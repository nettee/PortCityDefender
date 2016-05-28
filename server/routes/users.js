var express = require('express');
var router = express.Router();
var users = require('../models/users');

// GET users list
router.get('/', function (req, res) {
    var query = req.query;
    if (query.id) {
        var condition = {'id': query.id};
    } else if (query.name) {
        var condition = {'name': query.name};
    } else if (query.level) {
        var condition = {'level': query.level};
    } else if (query.region) {
        var condition = {'region': query.region};
    } else {
        var condition = {};
    }
    users.find(condition, function(err, list) {
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
    if (!users.isCompleteUser(user)) {
        res.status(400).send('User information not complete');
        return;
    }
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
    if (!users.isCompleteUser(user)) {
        res.status(400).send('User information not complete');
        return;
    }
    users.existsId(id, function(err, exists) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (!exists) {
            res.status(400).send('user ID does not exist');
            return;
        }
        users.updateById(id, user, function(err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(201).send(user);
        });
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
